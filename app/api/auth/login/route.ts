/**
 * POST /api/auth/login
 * 
 * Authenticates a user with email and password.
 * Returns a JWT token and sets it as an HTTP-only cookie.
 * 
 * Security: All authentication failures return the same generic error message
 * to prevent user enumeration attacks.
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { verifyPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Fetch user from database with password hash for verification
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', email)
      .single();

    // Generic error message prevents user enumeration
    // Don't reveal whether email exists or password is wrong
    if (dbError || !user) {
      if (dbError) {
        console.error('Supabase error:', dbError);
      }
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Verify password against stored hash
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Generate JWT token with user information
    const token = generateToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });

    // Set HTTP-only cookie to prevent XSS attacks
    // Secure flag enabled in production for HTTPS-only transmission
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
