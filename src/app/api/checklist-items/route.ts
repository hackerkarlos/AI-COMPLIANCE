import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifySameOrigin } from '@/lib/security/csrf';
import { z } from 'zod';

const ChecklistUpdateSchema = z.object({
  checklistItemId: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'not_applicable']),
  notes: z.string().nullable().optional(),
  evidenceUrl: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const csrfError = verifySameOrigin(request);
    if (csrfError) return csrfError;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get company ID
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = ChecklistUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { checklistItemId, status, notes, evidenceUrl } = parsed.data;

    const { data, error } = await supabase
      .from('company_checklist')
      .upsert(
        {
          company_id: company.id,
          checklist_item_id: checklistItemId,
          status,
          notes: notes,
          evidence_url: evidenceUrl,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          completed_by: user.id,
        },
        { onConflict: 'company_id,checklist_item_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to update checklist item:', error);
      return NextResponse.json(
        { error: 'Failed to update checklist item', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Checklist API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
