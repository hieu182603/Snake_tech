import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { z } from 'zod';
import { JWT_CONFIG } from '../../utils/jwt.js';

// Validation schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email'),
});

export const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateProfileSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
});

export class AuthController {
    /**
     * Register new account
     */
    static async register(req: Request, res: Response) {
        try {
            const parse = registerSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const result = await AuthService.register(parse.data);
            return res.status(201).json(result);
        } catch (error: any) {
            if (error.message === 'Email already registered') {
                return res.status(409).json({ message: error.message });
            }
            console.error('Register error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Login
     */
    static async login(req: Request, res: Response) {
        try {
            const parse = loginSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const result = await AuthService.login(parse.data);

            // Set refresh token as httpOnly cookie
            res.cookie(
                JWT_CONFIG.REFRESH_TOKEN.COOKIE_NAME,
                result.refreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                }
            );

            // Return access token and account data
            return res.status(200).json({
                accessToken: result.accessToken,
                account: result.account
            });
        } catch (error: any) {
            if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
                return res.status(401).json({ message: error.message });
            }
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Refresh access token
     */
    static async refresh(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies[JWT_CONFIG.REFRESH_TOKEN.COOKIE_NAME];

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token not found' });
            }

            const result = await AuthService.refresh(refreshToken);

            // Set new refresh token cookie
            res.cookie(
                JWT_CONFIG.REFRESH_TOKEN.COOKIE_NAME,
                result.refreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                }
            );

            return res.status(200).json({
                accessToken: result.accessToken
            });
        } catch (error: any) {
            if (error.message === 'Invalid refresh token' || error.message === 'Account not found') {
                return res.status(401).json({ message: error.message });
            }
            console.error('Refresh error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Logout
     */
    static async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies[JWT_CONFIG.REFRESH_TOKEN.COOKIE_NAME];

            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }

            // Clear refresh token cookie
            res.clearCookie(JWT_CONFIG.REFRESH_TOKEN.COOKIE_NAME, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(200).json({ message: 'Logout successful' });
        } catch (error: any) {
            console.error('Logout error:', error);
            // Still clear cookie even if logout service fails
            res.clearCookie(JWT_CONFIG.REFRESH_TOKEN.COOKIE_NAME, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get current account
     */
    static async getCurrentAccount(req: Request, res: Response) {
        try {
            const account = await AuthService.getCurrentAccount((req as any).user.userId);
            return res.status(200).json(account);
        } catch (error: any) {
            if (error.message === 'Account not found') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Get current account error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update account
     */
    static async updateAccount(req: Request, res: Response) {
        try {
            const accountId = (req as any).user.userId;
            const updateData = req.body;

            const account = await AuthService.updateAccount(accountId, updateData);
            return res.status(200).json(account);
        } catch (error: any) {
            if (error.message === 'Account not found') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Update account error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Change password
     */
    static async changePassword(req: Request, res: Response) {
        try {
            const accountId = (req as any).user.userId;
            const { oldPassword, newPassword } = req.body;

            const result = await AuthService.changePassword(accountId, oldPassword, newPassword);
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Account not found' || error.message === 'Current password is incorrect') {
                return res.status(400).json({ message: error.message });
            }
            console.error('Change password error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Verify registration with OTP
     */
    static async verifyRegister(req: Request, res: Response) {
        try {
            const result = await AuthService.verifyRegister(req.body);
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message.includes('Invalid') || error.message.includes('expired') || error.message.includes('already verified')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Verify register error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Resend OTP
     */
    static async resendOTP(req: Request, res: Response) {
        try {
            const { identifier } = req.body;
            const result = await AuthService.resendOTP(identifier);
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Account not found') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Resend OTP error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Forgot password - send reset OTP
     */
    static async forgotPassword(req: Request, res: Response) {
        try {
            const parse = forgotPasswordSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const result = await AuthService.forgotPassword(parse.data.email);
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Account not found' || error.message === 'Account not verified') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Forgot password error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Reset password with OTP
     */
    static async resetPassword(req: Request, res: Response) {
        try {
            const parse = resetPasswordSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const result = await AuthService.resetPassword(parse.data);
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message.includes('Invalid') || error.message.includes('expired') || error.message.includes('not found')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Reset password error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update user profile
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            const parse = updateProfileSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const accountId = (req as any).user.userId;
            const result = await AuthService.updateProfile(accountId, parse.data);
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Account not found') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Update profile error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}



