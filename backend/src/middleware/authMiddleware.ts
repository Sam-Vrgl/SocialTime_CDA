import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; role: string };
    }
  }
}

export function requireAuth(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }
  try {
    const { sub, role } = verifyToken(auth.slice(7));
    req.user = { sub, role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
}

