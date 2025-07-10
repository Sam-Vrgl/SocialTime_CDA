// src/middleware/adminMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden: admin access required' });
    return;
  }
  next();
}
