import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

/**
 * Middleware to check if user is authenticated
 * Attaches userId and isAdmin to request if session exists
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // Attach user info to request
  (req as AuthRequest).userId = req.session.userId;
  (req as AuthRequest).isAdmin = req.session.isAdmin || false;

  next();
}

/**
 * Middleware to check if user is admin
 * Requires authentication and admin flag
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (!req.session.isAdmin) {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  // Attach user info to request
  (req as AuthRequest).userId = req.session.userId;
  (req as AuthRequest).isAdmin = true;

  next();
}

/**
 * Optional middleware to attach user info if logged in
 * Does not require authentication - continues even if not logged in
 */
export function attachUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.session?.userId) {
    (req as AuthRequest).userId = req.session.userId;
    (req as AuthRequest).isAdmin = req.session.isAdmin || false;
  }
  next();
}
