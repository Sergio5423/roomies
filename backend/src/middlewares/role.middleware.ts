import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types/user';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: `Acceso prohibido. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}.` 
      });
      return;
    }

    next();
  };
};