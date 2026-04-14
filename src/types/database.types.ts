/**
 * TypeScript types for the Supabase database schema.
 * Generated from the production database schema.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          name: string;
          cvr_number: string | null;
          industry_sector: string | null;
          company_size: 'micro' | 'small' | 'medium' | 'large' | null;
          employee_count: number | null;
          annual_turnover_eur: number | null;
          country: string;
          city: string | null;
          postal_code: string | null;
          contact_name: string | null;
          contact_email: string | null;
          processes_personal_data: boolean;
          processes_special_categories: boolean;
          operates_online: boolean;
          uses_ai_systems: boolean;
          processes_payments: boolean;
          is_financial_entity: boolean;
          has_critical_infrastructure: boolean;
          has_employees: boolean;
          onboarding_completed: boolean;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      regulations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          name: string;
          short_name: string;
          description: string | null;
          authority: string | null;
          regulation_type: 'eu_regulation' | 'eu_directive' | 'dk_law' | null;
          effective_date: string | null;
          enforcement_date: string | null;
          applicability_criteria: Json;
          risk_level: 'low' | 'medium' | 'high' | 'critical' | null;
          max_fine_description: string | null;
          official_url: string | null;
          is_active: boolean;
          display_order: number;
        };
        Insert: Omit<Database['public']['Tables']['regulations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['regulations']['Insert']>;
      };
      checklist_items: {
        Row: {
          id: string;
          regulation_id: string;
          created_at: string;
          updated_at: string;
          code: string;
          title: string;
          description: string | null;
          guidance: string | null;
          category: string | null;
          priority: 'critical' | 'high' | 'medium' | 'low';
          effort_level: 'minimal' | 'moderate' | 'significant';
          display_order: number;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['checklist_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['checklist_items']['Insert']>;
      };
      company_regulations: {
        Row: {
          id: string;
          company_id: string;
          regulation_id: string;
          created_at: string;
          updated_at: string;
          is_applicable: boolean;
          applicability_reason: string | null;
          status: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant';
          compliance_score: number;
          last_assessed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['company_regulations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['company_regulations']['Insert']>;
      };
      company_checklist: {
        Row: {
          id: string;
          company_id: string;
          checklist_item_id: string;
          created_at: string;
          updated_at: string;
          status: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
          notes: string | null;
          evidence_url: string | null;
          completed_at: string | null;
          completed_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['company_checklist']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['company_checklist']['Insert']>;
      };
      assessments: {
        Row: {
          id: string;
          company_id: string;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          assessment_type: 'initial' | 'periodic' | 'triggered';
          status: 'draft' | 'in_progress' | 'completed' | 'archived';
          overall_score: number;
          overall_risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical' | null;
          responses: Json;
          ai_analysis: Json;
          recommendations: Json;
          version: number;
          is_latest: boolean;
        };
        Insert: Omit<Database['public']['Tables']['assessments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assessments']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
