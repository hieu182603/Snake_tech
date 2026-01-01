import jwt from 'jsonwebtoken';

// JWT Configuration
export const JWT_CONFIG = {
    ACCESS_TOKEN: {
        SECRET: process.env.JWT_ACCESS_SECRET || 'snake_access_secret_dev',
        EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        COOKIE_NAME: 'snakeAccessToken',
    },
    REFRESH_TOKEN: {
        SECRET: process.env.JWT_REFRESH_SECRET || 'snake_refresh_secret_dev',
        EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        COOKIE_NAME: 'snakeRefreshToken',
    }
};

// Global refresh token store (in production, use Redis or database)
const refreshTokens = new Map();

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: any): string => {
    return jwt.sign(payload, JWT_CONFIG.ACCESS_TOKEN.SECRET, {
        expiresIn: JWT_CONFIG.ACCESS_TOKEN.EXPIRES_IN
    });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: any): string => {
    return jwt.sign(payload, JWT_CONFIG.REFRESH_TOKEN.SECRET, {
        expiresIn: JWT_CONFIG.REFRESH_TOKEN.EXPIRES_IN
    });
};

/**
 * Generate token pair for account
 */
export const generateTokenPair = (account: any) => {
    const payload = {
        userId: account._id.toString(),
        email: account.email,
        role: account.role || 'CUSTOMER'
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token with user ID for rotation
    refreshTokens.set(account._id.toString(), refreshToken);

    return { accessToken, refreshToken };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN.SECRET);
    } catch (error) {
        throw error;
    }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_CONFIG.REFRESH_TOKEN.SECRET);
    } catch (error) {
        throw error;
    }
};

/**
 * Rotate Refresh Token
 */
export const rotateRefreshToken = (oldRefreshToken: string, account: any) => {
    try {
        // Verify the old refresh token
        const decoded = verifyRefreshToken(oldRefreshToken);

        // Check if token exists in our store
        const storedToken = refreshTokens.get(decoded.userId);
        if (!storedToken || storedToken !== oldRefreshToken) {
            throw new Error('Invalid refresh token');
        }

        // Remove old token
        refreshTokens.delete(decoded.userId);

        // Generate new token pair
        return generateTokenPair(account);
    } catch (error) {
        throw new Error('Refresh token rotation failed');
    }
};

/**
 * Revoke Refresh Token (logout)
 */
export const revokeRefreshToken = (userId: string) => {
    refreshTokens.delete(userId);
};

/**
 * Check if refresh token is valid
 */
export const isRefreshTokenValid = (token: string): boolean => {
    try {
        const decoded = verifyRefreshToken(token);
        const storedToken = refreshTokens.get(decoded.userId);
        return storedToken === token;
    } catch (error) {
        return false;
    }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.split(" ")[1];
};