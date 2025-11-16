/**
 * POST /api/auth/register
 * 
 * Registers a new user account.
 * Validates email uniqueness, hashes password, and returns authentication token.
 * 
 * Security: Passwords are hashed using bcrypt before storage.
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { hashPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if user with this email already exists
    // PGRST116 is Supabase's "no rows returned" code, which is expected for new users
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Supabase existingUser error:', existingError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 },
      );
    }

    // Hash password before storing - never store plain text passwords
    const passwordHash = await hashPassword(password);

    // Create new user in database
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
      })
      .select('id, email, name')
      .single();

    if (insertError || !user) {
      console.error('Supabase insert user error:', insertError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    // Generate JWT token for immediate authentication after registration
    const token = generateToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });

    // Set authentication cookie
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
