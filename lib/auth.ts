/**
 * Authentication utilities for JWT-based authentication.
 * 
 * This module handles password hashing, JWT token generation/verification,
 * and user authentication from HTTP requests.
 */
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Fallback secret for development only - must be set in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface JWTPayload {
  userId: number;
  email: string;
}

/**
 * Hashes a password using bcrypt with a cost factor of 10.
 * Higher cost = more secure but slower. Cost of 10 is a good balance.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verifies a plain text password against a bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a JWT token with user information.
 * Token expires in 7 days for better UX while maintaining security.
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies and decodes a JWT token.
 * Returns null if token is invalid, expired, or malformed.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extracts and verifies the current user from the request cookies.
 * Returns null if no valid token is found.
 */
export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Requires authentication for a request.
 * Throws an error if the user is not authenticated.
 * Use this in protected routes to ensure only authenticated users can access them.
 */
export async function requireAuth(request: NextRequest): Promise<JWTPayload> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

