import jwt from 'jsonwebtoken';
import { RefreshToken } from '../modules/auth/models/refreshToken.model.js';
import { hashPassword, comparePassword } from './hash.js';

// JWT Configuration
export const JWT_CONFIG = {
    ACCESS_TOKEN: {
        SECRET: process.env.JWT_SECRET || 'snake_access_secret_dev',
        EXPIRES_IN: '15m',
        COOKIE_NAME: 'snakeAccessToken',
    },
    REFRESH_TOKEN: {
        SECRET: process.env.JWT_SECRET || 'snake_refresh_secret_dev',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
        COOKIE_NAME: 'snakeRefreshToken',
    }
};

// Refresh tokens are now stored in the database using the RefreshToken model

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: any): string => {
    return jwt.sign(payload, JWT_CONFIG.ACCESS_TOKEN.SECRET, {
        expiresIn: JWT_CONFIG.ACCESS_TOKEN.EXPIRES_IN
    } as jwt.SignOptions);
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: any): string => {
    return jwt.sign(payload, JWT_CONFIG.REFRESH_TOKEN.SECRET, {
        expiresIn: JWT_CONFIG.REFRESH_TOKEN.EXPIRES_IN
    } as jwt.SignOptions);
};

/**
 * Generate token pair for account
 */
export const generateTokenPair = async (account: any) => {
    const payload = {
        userId: account._id.toString(),
        email: account.email,
        role: account.role || 'CUSTOMER'
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash and store refresh token in database
    const tokenHash = await hashPassword(refreshToken);

    // Remove any existing refresh tokens for this account
    await RefreshToken.deleteMany({ accountId: account._id });

    // Store new refresh token
    await RefreshToken.create({
        accountId: account._id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { accessToken, refreshToken };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN.SECRET) as jwt.JwtPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_CONFIG.REFRESH_TOKEN.SECRET) as jwt.JwtPayload;
};

/**
 * Rotate Refresh Token
 */
export const rotateRefreshToken = async (oldRefreshToken: string, account: any) => {
    // Verify the old refresh token
    const decoded = verifyRefreshToken(oldRefreshToken);

    // Find the refresh token in database
    const refreshTokenDoc = await RefreshToken.findOne({
        accountId: decoded.userId,
        revokedAt: null,
        expiresAt: { $gt: new Date() }
    });

    if (!refreshTokenDoc) {
        throw new Error('Refresh token not found');
    }

    // Verify the token hash matches
    const isValidToken = await comparePassword(oldRefreshToken, refreshTokenDoc.tokenHash);
    if (!isValidToken) {
        throw new Error('Invalid refresh token');
    }

    // Revoke old token
    refreshTokenDoc.revokedAt = new Date();
    await refreshTokenDoc.save();

    // Generate new token pair
    return await generateTokenPair(account);
};

/**
 * Revoke Refresh Token (logout)
 */
export const revokeRefreshToken = async (userId: string) => {
    await RefreshToken.updateMany(
        { accountId: userId, revokedAt: null },
        { revokedAt: new Date() }
    );
};

/**
 * Check if refresh token is valid
 */
export const isRefreshTokenValid = async (token: string): Promise<boolean> => {
    try {
        const decoded = verifyRefreshToken(token);
        const refreshTokenDoc = await RefreshToken.findOne({
            accountId: decoded.userId,
            revokedAt: null,
            expiresAt: { $gt: new Date() }
        });

        if (!refreshTokenDoc) {
            return false;
        }

        return await comparePassword(token, refreshTokenDoc.tokenHash);
    } catch {
        return false;
    }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.split(" ")[1];
};