/**
 * POST /api/auth/logout
 * 
 * Logs out the current user by deleting the authentication cookie.
 * No authentication required - allows logout even with invalid tokens.
 */
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('token');
  return response;
}

