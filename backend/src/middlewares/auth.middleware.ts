import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';
import { Account } from '../modules/auth/models/account.model.js';

/**
 * Authentication middleware - verifies access token
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(401).json({ message: 'No authentication token' });
        }

        const decoded = verifyAccessToken(token);

        // Check if account is still active
        if (decoded.userId) {
            const account = await Account.findById(decoded.userId).select('isActive').lean();
            if (!account) {
                return res.status(401).json({ message: 'Account not found' });
            }
            if (!account.isActive) {
                return res.status(403).json({
                    message: 'Account is deactivated'
                });
            }
        }

        (req as any).user = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid access token' });
        }
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

/**
 * Role-Based Access Control middleware
 */
export const rbacMiddleware = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!(req as any).user || !(req as any).user.userId) {
                return res.status(401).json({
                    message: 'Authentication required'
                });
            }

            const userRole = (req as any).user.role;

            if (!userRole) {
                return res.status(403).json({
                    message: 'No role found in token'
                });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`
                });
            }

            next();
        } catch (error) {
            console.error('[rbacMiddleware] Error:', error);
            return res.status(500).json({
                message: 'Authorization check failed'
            });
        }
    };
};






