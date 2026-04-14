-- Production RLS Verification Script
-- Run these queries in Supabase SQL Editor to verify RLS is properly configured
-- in production after deployment.

-- =============================================================
-- 1. Verify RLS is enabled on all tables
-- =============================================================
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'companies',
    'regulations',
    'checklist_items',
    'company_regulations',
    'company_checklist',
    'assessments'
  )
ORDER BY tablename;

-- =============================================================
-- 2. List all RLS policies
-- =============================================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS command,
    qual AS using_clause,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =============================================================
-- 3. Summary: RLS status and policy counts per table
-- =============================================================
SELECT
    t.tablename,
    t.rowsecurity AS rls_enabled,
    COALESCE(p.policy_count, 0) AS policy_count
FROM
    (SELECT tablename, rowsecurity
     FROM pg_tables
     WHERE schemaname = 'public'
       AND tablename IN (
         'companies', 'regulations', 'checklist_items',
         'company_regulations', 'company_checklist', 'assessments'
       )
    ) t
    LEFT JOIN (
        SELECT tablename, COUNT(*) AS policy_count
        FROM pg_policies
        WHERE schemaname = 'public'
        GROUP BY tablename
    ) p ON t.tablename = p.tablename
ORDER BY t.tablename;

-- =============================================================
-- 4. Verify no orphaned tables without RLS
-- =============================================================
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND NOT tablename LIKE 'audit%'  -- exclude audit tables
  AND NOT rowsecurity
  AND tablename NOT IN ('_prisma_migrations');  -- exclude migration tables

-- Expected: Empty result (all business tables should have RLS enabled)

-- =============================================================
-- 5. Verify service_role bypass works correctly
-- =============================================================
-- This is a conceptual check — in practice, run as an authenticated user
-- with limited privileges to confirm RLS applies.
--
-- As anon user: should only see regulations/checklist_items (public read)
-- As authenticated user: should only see own company/data
-- As service_role: should see everything (RLS bypass)
