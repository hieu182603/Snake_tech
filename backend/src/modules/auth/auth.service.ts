import { Account, IAccount } from './models/account.model.js';
import { Otp as OTP } from './models/otp.model.js';
import { sendMail } from '../../utils/mailer.js';
import { generateTokenPair, rotateRefreshToken, revokeRefreshToken } from '../../utils/jwt.js';
import { comparePassword, hashPassword } from '../../utils/hash.js';
import { generateOTP, hashOTP, compareOTP } from '../../utils/otp.js';
import { registrationOtpTemplate, resetPasswordTemplate } from '../../utils/emailTemplates.js';

export class AuthService {
    // Register new account
    static async register(accountData: {
        email: string;
        password: string;
        fullName: string;
        phone?: string;
    }) {
        const { email, password, fullName, phone } = accountData;

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if email already exists
        const existingAccount = await Account.findOne({ email: normalizedEmail });
        if (existingAccount) {
            throw new Error('Email already registered');
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create new account
        const account = await Account.create({
            email: normalizedEmail,
            passwordHash,
            fullName: fullName.trim(),
            phone: phone?.trim(),
            role: 'CUSTOMER', // Default role
            isActive: true,
            isVerified: false,
        });

        // Generate and save OTP for email verification (REGISTER)
        try {
            const otp = generateOTP();
            const otpHash = await hashOTP(otp);

            // Remove any previous REGISTER OTPs for this email
            await OTP.deleteMany({
                target: normalizedEmail,
                purpose: 'REGISTER'
            });

            await OTP.create({
                target: normalizedEmail,
                purpose: 'REGISTER',
                otpHash: otpHash,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            });

            // Send OTP via email (best-effort) using template
            try {
                const tpl = registrationOtpTemplate(account.fullName, otp);
                await sendMail({
                    to: account.email,
                    subject: tpl.subject,
                    text: tpl.text,
                    html: tpl.html
                });
            } catch (e) {
                console.error('Failed to send registration OTP email:', e);
            }

            // Log OTP in non-production only (debug)
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Registration OTP for ${account.email}: ${otp}`);
            }
        } catch (e) {
            console.error('Failed to generate/save OTP during register:', e);
        }

        return {
            message: 'Account created successfully',
            accountId: account._id,
            email: account.email,
        };
    }

    // Login
    static async login(credentials: { email: string; password: string }) {
        const { email, password } = credentials;

        // Find account
        const account = await Account.findOne({ email: email.toLowerCase() });
        if (!account) {
            throw new Error('Invalid credentials');
        }

        if (!account.isActive) {
            throw new Error('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, account.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate token pair
        const { accessToken, refreshToken } = await generateTokenPair(account);

        return {
            accessToken,
            refreshToken,
            account: {
                id: account._id,
                email: account.email,
                fullName: account.fullName,
                role: account.role,
                phone: account.phone,
                avatarUrl: account.avatarUrl,
                isActive: account.isActive,
                isVerified: account.isVerified,
            },
        };
    }

    // Refresh access token
    static async refresh(refreshToken: string) {
        try {
            // Verify refresh token to get user ID
            const decoded = require("../../utils/jwt.js").verifyRefreshToken(refreshToken);

            // Find account
            const account = await Account.findById(decoded.userId);
            if (!account) {
                throw new Error('Account not found');
            }

            if (!account.isActive) {
                throw new Error('Account is deactivated');
            }

            // Rotate refresh token and generate new pair
            const { accessToken, refreshToken: newRefreshToken } = await rotateRefreshToken(refreshToken, account);

            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    // Logout
    static async logout(refreshToken: string) {
        try {
            // Verify token to get user ID
            const decoded = require("../../utils/jwt.js").verifyRefreshToken(refreshToken);
            await revokeRefreshToken(decoded.userId);
        } catch (error) {
            // Even if verification fails, we don't throw error for logout
            console.warn('Logout with invalid token:', error.message);
        }
    }

    // Get current account
    static async getCurrentAccount(accountId: string) {
        const account = await Account.findById(accountId)
            .select('-passwordHash')
            .lean();

        if (!account) {
            throw new Error('Account not found');
        }

        return account;
    }

    // Update account
    static async updateAccount(accountId: string, updateData: Partial<IAccount>) {
        const account = await Account.findByIdAndUpdate(
            accountId,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        ).select('-passwordHash');

        if (!account) {
            throw new Error('Account not found');
        }

        return account;
    }

    // Change password
    static async changePassword(accountId: string, oldPassword: string, newPassword: string) {
        const account = await Account.findById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        // Verify old password
        const isOldPasswordValid = await comparePassword(oldPassword, account.passwordHash);
        if (!isOldPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const newPasswordHash = await hashPassword(newPassword);
        account.passwordHash = newPasswordHash;
        await account.save();

        return { message: 'Password changed successfully' };
    }

    // Verify account (for email verification)
    static async verifyAccount(email: string) {
        const account = await Account.findOne({ email: email.toLowerCase() });
        if (!account) {
            throw new Error('Account not found');
        }

        if (account.isVerified) {
            throw new Error('Account already verified');
        }

        account.isVerified = true;
        await account.save();

        return { message: 'Account verified successfully' };
    }

    // Verify registration with OTP
    static async verifyRegister(verifyData: {
        username: string;
        password: string;
        email: string;
        role: string;
        otp: string;
    }) {
        const { username, password, email, role, otp } = verifyData;

        // Find OTP record by target/purpose and verify hashed OTP
        const otpRecord = await OTP.findOne({
            target: email.toLowerCase(),
            purpose: 'REGISTER',
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            throw new Error('Invalid or expired OTP');
        }

        const isValidOtp = await compareOTP(otp, otpRecord.otpHash);
        if (!isValidOtp) {
            throw new Error('Invalid or expired OTP');
        }

        // Find the account (should exist from registration)
        const account = await Account.findOne({ email: email.toLowerCase() });
        if (!account) {
            throw new Error('Account not found');
        }

        if (account.isVerified) {
            throw new Error('Account already verified');
        }

        // Update account as verified and active
        account.isVerified = true;
        account.isActive = true;
        account.role = role.toUpperCase() as IAccount['role'];
        await account.save();

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokenPair(account);

        // refresh token already stored by generateTokenPair

        return {
            message: 'Registration verified successfully',
            account: {
                id: account._id,
                username: account.username,
                email: account.email,
                fullName: account.fullName,
                role: account.role,
                isVerified: account.isVerified
            },
            accessToken,
            refreshToken
        };
    }

    // Resend OTP
    static async resendOTP(identifier: string) {
        // Find account by email or username
        const account = await Account.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier }
            ]
        });

        if (!account) {
            throw new Error('Account not found');
        }

        // Generate new OTP and hash it
        const otp = generateOTP();
        const otpHash = await hashOTP(otp);

        // Delete any existing OTPs for this target/purpose
        await OTP.deleteMany({
            target: account.email,
            purpose: 'REGISTER'
        });

        // Save new OTP (hashed)
        await OTP.create({
            target: account.email,
            purpose: 'REGISTER',
            otpHash: otpHash,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        // Send OTP via email (best-effort)
        try {
            await sendMail({
                to: account.email,
                subject: 'Your verification code',
                text: `Your verification code is: ${otp}`,
                html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
            });
        } catch (e) {
            console.error('Failed to send OTP email:', e);
        }

        console.log(`OTP for ${account.email}: ${otp}`);

        return { message: 'OTP sent successfully' };
    }

    // Forgot password - send reset OTP
    static async forgotPassword(email: string) {
        const normalizedEmail = email.toLowerCase().trim();

        // Find account
        const account = await Account.findOne({ email: normalizedEmail });
        if (!account) {
            throw new Error('Account not found');
        }

        if (!account.isVerified) {
            throw new Error('Account not verified');
        }

        // Generate OTP and hash
        const otp = generateOTP();
        const otpHash = await hashOTP(otp);

        // Save OTP to database
        await OTP.create({
            target: normalizedEmail,
            purpose: 'RESET_PASSWORD',
            otpHash: otpHash,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        // Send OTP via email (best-effort) using template
        try {
            const tpl = resetPasswordTemplate(account.fullName, otp);
            await sendMail({
                to: account.email,
                subject: tpl.subject,
                text: tpl.text,
                html: tpl.html
            });
        } catch (e) {
            console.error('Failed to send password reset email:', e);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(`Password reset OTP for ${account.email}: ${otp}`);
        }

        return { message: 'Password reset OTP sent successfully' };
    }

    // Reset password with OTP
    static async resetPassword(resetData: { email: string; otp: string; newPassword: string }) {
        const { email, otp, newPassword } = resetData;
        const normalizedEmail = email.toLowerCase().trim();

        // Find OTP record by target/purpose and verify hashed OTP
        const otpRecord = await OTP.findOne({
            target: normalizedEmail,
            purpose: 'RESET_PASSWORD',
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            throw new Error('Invalid or expired OTP');
        }

        const isValid = await compareOTP(otp, otpRecord.otpHash);
        if (!isValid) {
            throw new Error('Invalid or expired OTP');
        }

        // Find account
        const account = await Account.findOne({ email: normalizedEmail });
        if (!account) {
            throw new Error('Account not found');
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword);

        // Update password
        account.passwordHash = passwordHash;
        await account.save();

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        return { message: 'Password reset successfully' };
    }

    // Update user profile
    static async updateProfile(accountId: string, profileData: {
        fullName?: string;
        phone?: string;
        avatar?: string;
    }) {
        const account = await Account.findById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        // Update fields
        if (profileData.fullName !== undefined) {
            account.fullName = profileData.fullName.trim();
        }
        if (profileData.phone !== undefined) {
            account.phone = profileData.phone?.trim();
        }
        if (profileData.avatar !== undefined) {
            account.avatar = profileData.avatar;
        }

        await account.save();

        return {
            message: 'Profile updated successfully',
            account: {
                id: account._id,
                email: account.email,
                fullName: account.fullName,
                phone: account.phone,
                avatar: account.avatar,
                role: account.role,
                isVerified: account.isVerified,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt
            }
        };
    }
}