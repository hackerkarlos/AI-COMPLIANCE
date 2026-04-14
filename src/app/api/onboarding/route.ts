import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { matchRegulations, type CompanyProfile } from '@/lib/regulations/matching';
import type { Regulation } from '@/types/assessment';
import { runAssessment } from '@/lib/ai/assess';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!checkRateLimit(user.id).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = (await request.json()) as CompanyProfile;

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    if (!body.industry_sector?.trim()) {
      return NextResponse.json({ error: 'Industry sector is required' }, { status: 400 });
    }

    // Derive company_size from employee_count
    const employeeCount = body.employee_count ?? 0;
    let companySize: 'micro' | 'small' | 'medium' | 'large' = 'micro';
    if (employeeCount >= 250) companySize = 'large';
    else if (employeeCount >= 50) companySize = 'medium';
    else if (employeeCount >= 10) companySize = 'small';

    // 1. Upsert company
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Shared fields for insert/update
    const companyFields = {
      name: body.name.trim(),
      cvr_number: body.cvr_number || null,
      industry_sector: body.industry_sector,
      company_size: companySize,
      employee_count: employeeCount,
      // Step 2: Data & Privacy
      processes_personal_data: body.processes_personal_data,
      processes_special_categories: body.processes_special_categories ?? false,
      uses_ai_systems: body.uses_ai_systems,
      // Step 3: Digital Presence
      operates_online: body.operates_online,
      processes_payments: body.processes_payments,
      annual_turnover_eur: body.annual_turnover_eur ?? null,
      // Step 4: Infrastructure
      is_financial_entity: body.is_financial_entity,
      has_critical_infrastructure: body.has_critical_infrastructure,
      contact_email: body.contact_email?.trim() || null,
      has_employees: employeeCount > 0,
      onboarding_completed: true,
    };

    let companyId: string;

    if (existingCompany) {
      const { error: updateError } = await supabase
        .from('companies')
        .update(companyFields)
        .eq('id', existingCompany.id);

      if (updateError) {
        console.error('Company update error:', updateError);
        return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
      }
      companyId = existingCompany.id;
    } else {
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert({ user_id: user.id, ...companyFields })
        .select('id')
        .single();

      if (insertError || !newCompany) {
        console.error('Company insert error:', insertError);
        return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
      }
      companyId = newCompany.id;
    }

    // 2. Fetch all active regulations
    const { data: regulations, error: regError } = await supabase
      .from('regulations')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (regError || !regulations) {
      console.error('Regulation fetch error:', regError);
      return NextResponse.json({ error: 'Failed to load regulations' }, { status: 500 });
    }

    // 3. Match regulations
    const matches = matchRegulations(body, regulations as Regulation[]);

    // 4. Delete existing company_regulations and company_checklist (for re-onboarding)
    await supabase.from('company_checklist').delete().eq('company_id', companyId);
    await supabase.from('company_regulations').delete().eq('company_id', companyId);

    // 5. Insert company_regulations
    const companyRegRows = matches.map((m) => ({
      company_id: companyId,
      regulation_id: m.regulation_id,
      is_applicable: m.is_applicable,
      applicability_reason: m.reason,
      status: 'not_started' as const,
      compliance_score: 0,
    }));

    const { error: crError } = await supabase.from('company_regulations').insert(companyRegRows);
    if (crError) {
      console.error('Company regulations insert error:', crError);
      return NextResponse.json({ error: 'Failed to save regulation mappings' }, { status: 500 });
    }

    // 6. Initialize company_checklist for all applicable regulations
    const applicableRegIds = matches.filter((m) => m.is_applicable).map((m) => m.regulation_id);

    if (applicableRegIds.length > 0) {
      const { data: checklistItems, error: ciError } = await supabase
        .from('checklist_items')
        .select('id, regulation_id')
        .in('regulation_id', applicableRegIds)
        .eq('is_active', true);

      if (ciError) {
        console.error('Checklist items fetch error:', ciError);
        return NextResponse.json({ error: 'Failed to load checklist items' }, { status: 500 });
      }

      if (checklistItems && checklistItems.length > 0) {
        const checklistRows = checklistItems.map((item) => ({
          company_id: companyId,
          checklist_item_id: item.id,
          status: 'not_started' as const,
        }));

        const { error: ccError } = await supabase.from('company_checklist').insert(checklistRows);
        if (ccError) {
          console.error('Company checklist insert error:', ccError);
          return NextResponse.json(
            { error: 'Failed to initialize checklist' },
            { status: 500 }
          );
        }
      }
    }

    // 7. Trigger initial AI assessment for each applicable regulation (fire & forget)
    for (const regId of applicableRegIds) {
      runAssessment(companyId, regId).catch((err) => {
        console.error(`Assessment failed for regulation ${regId}:`, err);
      });
    }

    return NextResponse.json({
      success: true,
      company_id: companyId,
      applicable_count: applicableRegIds.length,
      total_regulations: matches.length,
    });
  } catch (err) {
    console.error('Onboarding error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
