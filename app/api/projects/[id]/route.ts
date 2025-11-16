/**
 * Project by ID API Routes
 * 
 * GET /api/projects/[id] - Get a single project by ID
 * PUT /api/projects/[id] - Update a project by ID
 * DELETE /api/projects/[id] - Delete a project by ID
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
 * Formats a project database row into the API response format.
 * Converts budget from Decimal (string) to number for JSON serialization.
 */
function formatProject(project: any) {
  return {
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
}

/**
 * GET /api/projects/[id]
 * 
 * Retrieves a single project by its ID.
 * Returns 404 if project doesn't exist.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAuth(request);

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // PGRST116 is Supabase's code for "no rows returned"
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Supabase GET project error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    return NextResponse.json(formatProject(project));
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/projects/[id]
 * 
 * Updates a project by ID.
 * Only provided fields are updated (partial update).
 * Returns 404 if project doesn't exist.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAuth(request);

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
    }

    const body = await request.json();
    const data = projectSchema.parse(body);

    // Build update object with only provided fields (partial update)
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.deadline !== undefined) updateData.deadline = data.deadline;
    if (data.assigned_to !== undefined) updateData.assigned_to = data.assigned_to;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.description !== undefined) updateData.description = data.description;

    // Prevent empty updates
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 },
      );
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Supabase UPDATE project error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    return NextResponse.json(formatProject(project));
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * 
 * Deletes a project by ID.
 * Returns 404 if project doesn't exist.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAuth(request);

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
    }

    // Delete and verify the project existed
    const { error, data } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('Supabase DELETE project error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
