/**
 * POST /api/assessments
 *
 * Triggers an AI-powered compliance assessment for the authenticated user's company
 * against a given regulation slug.
 *
 * Body: { regulation_slug: string }
 * Returns: { assessmentId: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runAssessment } from '@/lib/ai/assess';
import { verifySameOrigin } from '@/lib/security/csrf';

export async function POST(request: NextRequest) {
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

    const body = await request.json() as { regulation_slug?: unknown };
    const { regulation_slug } = body;

    if (!regulation_slug || typeof regulation_slug !== 'string') {
      return NextResponse.json(
        { error: 'regulation_slug is required' },
        { status: 400 }
      );
    }

    // Fetch the company for this user
    const { data: company } = await supabase
      .from('companies')
      .select('id, onboarding_completed')
      .eq('user_id', user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    if (!company.onboarding_completed) {
      return NextResponse.json(
        { error: 'Company onboarding not completed' },
        { status: 400 }
      );
    }

    // Fetch the regulation by slug
    const { data: regulation } = await supabase
      .from('regulations')
      .select('id, name, slug')
      .eq('slug', regulation_slug)
      .eq('is_active', true)
      .single();

    if (!regulation) {
      return NextResponse.json(
        { error: `Regulation '${regulation_slug}' not found` },
        { status: 404 }
      );
    }

    // Run the AI assessment and persist results
    const { assessmentId } = await runAssessment(company.id, regulation.id);

    return NextResponse.json({ assessmentId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[POST /api/assessments] Error:', message);
    return NextResponse.json({ error: 'Assessment failed', detail: message }, { status: 500 });
  }
}
