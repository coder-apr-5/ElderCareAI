/**
 * ElderNest AI - Authentication Middleware
 * Firebase token verification and role-based access control.
 */

import { Response, NextFunction } from 'express';
import { auth, collections } from '../config/firebase';
import { AuthenticatedRequest, UserRole, DecodedUser } from '../types';
import { sendUnauthorized, sendForbidden } from '../utils/responses';
import { logger } from '../utils/logger';

const extractToken = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      sendUnauthorized(res, 'No authentication token provided');
      return;
    }

    // ━━━ MOCK AUTH FOR DEVELOPMENT ━━━
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock_')) {
      logger.info('🔓 Using mock authentication token');
      try {
        // Expected format: mock_base64json
        const jsonStr = Buffer.from(token.replace('mock_', ''), 'base64').toString('utf-8');
        const mockUser = JSON.parse(jsonStr);

        req.user = {
          uid: mockUser.uid || 'mock-user-id',
          email: mockUser.email || 'mock@eldernest.ai',
          role: mockUser.role || 'elder',
          emailVerified: true,
        };

        logger.debug(`Authenticated mock user: ${req.user.uid} (${req.user.role})`);
        next();
        return;
      } catch (e) {
        logger.warn('Failed to parse mock token', e);
        // Fall through to real verification
      }
    }

    const decodedToken = await auth.verifyIdToken(token);

    let role: UserRole = 'elder';
    try {
      const userDoc = await collections.users.doc(decodedToken.uid).get();
      if (userDoc.exists) {
        role = userDoc.data()?.role || 'elder';
      }
    } catch (firestoreError) {
      logger.warn('Could not fetch user role:', firestoreError);
    }

    const decodedUser: DecodedUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role,
      emailVerified: decodedToken.email_verified,
    };

    req.user = decodedUser;
    logger.debug(`Authenticated user: ${decodedUser.uid} (${decodedUser.role})`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        sendUnauthorized(res, 'Token expired. Please log in again.');
        return;
      }
    }
    // If running in demo mode without valid creds, verifyIdToken will fail.
    // We should inform developer.
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Authentication failed. If you are using Mock Mode, ensure your controller returns a mock_ token.');
    }
    sendUnauthorized(res, 'Invalid authentication token');
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);
    if (token) {
      const decodedToken = await auth.verifyIdToken(token);
      let role: UserRole = 'elder';
      try {
        const userDoc = await collections.users.doc(decodedToken.uid).get();
        if (userDoc.exists) role = userDoc.data()?.role || 'elder';
      } catch { /* ignore */ }
      req.user = { uid: decodedToken.uid, email: decodedToken.email, role };
    }
    next();
  } catch {
    next();
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      sendForbidden(res, 'You do not have permission to access this resource');
      return;
    }
    next();
  };
};

export const requireElder = requireRole('elder');
export const requireFamily = requireRole('family');
export const requireElderOrFamily = requireRole('elder', 'family');
export const requireAdmin = requireRole('admin');

export default authenticate;
