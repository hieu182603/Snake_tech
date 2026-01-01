import { Request, Response, NextFunction } from 'express';

export const rbacMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // User info is attached by authMiddleware
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: 'Access denied. Insufficient permissions.',
          requiredRoles: allowedRoles,
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      console.error('RBAC middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};