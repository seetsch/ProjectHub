/**
 * Projects API Routes
 * 
 * GET /api/projects - List all projects with optional filtering and search
 * POST /api/projects - Create a new project
 * 
 * All routes require authentication.
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(['active', 'on hold', 'completed']).optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // ISO date format: YYYY-MM-DD
  assigned_to: z.string().min(1).optional(),
  budget: z.number().positive().optional(),
  description: z.string().optional(),
});

/**
 * GET /api/projects
 * 
 * Retrieves all projects with optional filtering by status and search query.
 * Supports query parameters:
 * - status: Filter by project status ('active', 'on hold', 'completed')
 * - search: Search in title, assigned_to, and description fields (case-insensitive)
 * 
 * Returns projects ordered by creation date (newest first).
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Build query with optional filters
    let query = supabase.from('projects').select('*');

    if (status) {
      query = query.match({ status });
    }

    // Search across multiple fields using PostgreSQL's ILIKE operator
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,assigned_to.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data: projects, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Supabase GET projects error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // Format response: ensure budget is a number (Supabase returns Decimal as string)
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      deadline: project.deadline,
      assigned_to: project.assigned_to,
      budget: Number(project.budget),
      description: project.description,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/projects
 * 
 * Creates a new project.
 * All fields except description are required.
 * 
 * Returns the created project with generated ID and timestamps.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();
    const data = projectSchema.parse(body);

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          title: data.title,
          status: data.status,
          deadline: data.deadline,
          assigned_to: data.assigned_to,
          budget: data.budget,
          description: data.description || null,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase CREATE project error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // Format response for consistency
    const formattedProject = {
      id: project.id,
      title: project.title,
      status: project.status,
      deadline: project.deadline,
      assigned_to: project.assigned_to,
      budget: Number(project.budget),
      description: project.description,
      created_at: project.created_at,
      updated_at: project.updated_at,
    };

    return NextResponse.json(formattedProject, { status: 201 });
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}