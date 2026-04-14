#!/bin/bash
# Vercel Environment Setup Script
# Run this script or use the Vercel dashboard to set environment variables

set -e

echo "=== Vercel Environment Variable Setup ==="
echo ""

# Check if user has provided values
if [ -z "$VERCEL_PROJECT_ID" ]; then
    echo "⚠️  VERCEL_PROJECT_ID not set. Using default project name."
    echo "   Run: vercel link --project eucomply"
fi

# Check if .env.production has real values
if grep -q "production-anon-key" .env.production 2>/dev/null; then
    echo "❌ .env.production contains placeholder values"
    echo "   Update with real Supabase keys before deploying"
    echo ""
    echo "Required environment variables:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=https://pcjswfyfhawdgveleizc.supabase.co"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=<get-from-supabase-dashboard>"
    echo "  SUPABASE_SERVICE_ROLE_KEY=<get-from-supabase-dashboard>"
    echo "  ANTHROPIC_API_KEY=<your-anthropic-api-key>"
    exit 1
fi

echo "✅ Environment variables verified"
echo ""
echo "Next steps:"
echo "1. Run: vercel link --project eucomply"
echo "2. Run: vercel --prod"
echo "3. Add environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (Production: Preview: Development)"
echo "   - SUPABASE_SERVICE_ROLE_KEY (Secret, Production only)"
echo "   - ANTHROPIC_API_KEY (Secret, Production only)"
echo ""
echo "4. Configure staging domain: staging.eucomply.com"
echo "   vercel domains add staging.eucomply.com --git-branch staging"
