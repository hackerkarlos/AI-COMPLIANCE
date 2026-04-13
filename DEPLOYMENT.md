# Deployment Guide

This guide covers deployment of EUComply to Vercel, Supabase project setup, and DNS configuration.

## 1. Vercel Deployment

### Prerequisites

- Vercel account (connected to your GitHub/GitLab)
- Supabase project (see section 2)
- Domain name (optional, for custom domain)

### Deployment Steps

1. **Push your code** to a Git repository (GitHub, GitLab, or Bitbucket).

2. **Import project** in Vercel:
   - Log in to [Vercel Dashboard](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your Git repository
   - Configure project settings (see below)

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install`
   - **Node Version**: 20.x (or latest LTS)

4. **Environment Variables**:
   Add the following environment variables in Vercel project settings:

   | Variable | Value | Description |
   |----------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Supabase anonymous key |
   | `SUPABASE_PROJECT_ID` | `your-project-id` | Supabase project ID |
   | `ANTHROPIC_API_KEY` | `your-api-key` | Anthropic Claude API key |
   | `NODE_ENV` | `production` | Node environment |

   **Note**: For security, mark `ANTHROPIC_API_KEY` as "Secret" (encrypted).

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll receive a `.vercel.app` domain (e.g., `eucomply.vercel.app`)

### Custom Domain (Optional)

1. **Add Domain** in Vercel:
   - Go to Project → Domains
   - Enter your domain (e.g., `eucomply.com`)
   - Follow DNS configuration instructions

2. **Configure DNS**:
   - Add the required CNAME or A records in your domain registrar's DNS settings
   - Wait for DNS propagation (up to 48 hours)

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates via Let's Encrypt

## 2. Supabase Project Setup

### Create New Project

1. **Sign up/Log in** to [Supabase](https://supabase.com)

2. **Create Project**:
   - Click "New Project"
   - Enter project name: `eucomply`
   - Set database password (store securely)
   - Choose region: `eu-north-1` (Stockholm) for GDPR compliance
   - Click "Create new project"

3. **Configure Project**:
   - Wait for database provisioning (2-3 minutes)
   - Navigate to Project Settings → API
   - Note: `Project URL` and `anon public` key

### Database Schema

1. **Apply Migrations**:
   Use Supabase MCP tools to apply migrations:
   ```bash
   # Apply all pending migrations
   apply_migration
   ```

2. **Manual Setup (Alternative)**:
   - Navigate to SQL Editor in Supabase Dashboard
   - Run the SQL from `supabase/migrations/` folder

### Authentication

1. **Enable Auth Providers**:
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure "Magic Link" (recommended)
   - Disable "Confirm email" if using magic links

2. **Configure Redirect URLs**:
   - Add your Vercel domain to "Site URL" and "Redirect URLs"
   - Format: `https://your-domain.vercel.app/**`
   - Include localhost for development: `http://localhost:3100/**`

### Row Level Security (RLS)

Ensure RLS is enabled on all tables:
- Navigate to Authentication → Policies
- Create policies for each table based on user roles

### Environment Variables

Update your local `.env.local` and Vercel environment variables with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
```

## 3. DNS Configuration

### Vercel Domain

If using Vercel's default domain (`*.vercel.app`), no DNS configuration is needed.

### Custom Domain with Vercel

1. **Vercel DNS**:
   - In Vercel Domains, click "Add Domain"
   - Enter domain (e.g., `eucomply.com`)
   - Choose "Vercel DNS" if you want Vercel to manage DNS

2. **External DNS**:
   If using external DNS provider (Cloudflare, GoDaddy, etc.):
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records pointing to Vercel's IP addresses:
     ```
     76.76.21.21
     76.76.21.22
     ```

### Subdomain Setup

For `app.eucomply.com`:
- Add CNAME record: `app` → `cname.vercel-dns.com`

### SSL/TLS

- Vercel automatically handles SSL certificate provisioning
- For custom domains, enable "Force HTTPS" in Vercel project settings

## 4. Post-Deployment Checks

### Verify Deployment

1. **Visit your domain** and ensure the application loads
2. **Test authentication** flow (sign up, login, magic link)
3. **Verify API endpoints** are accessible
4. **Check console for errors** (browser dev tools)

### Monitoring

1. **Vercel Analytics**:
   - Enable Vercel Analytics for performance monitoring
   - Set up Web Vitals tracking

2. **Supabase Monitoring**:
   - Monitor database performance in Supabase Dashboard
   - Set up alerts for high CPU usage or storage limits

3. **Error Tracking**:
   - Consider integrating Sentry or LogRocket for error tracking

### Backup Strategy

1. **Database Backups**:
   - Supabase provides daily backups automatically
   - Enable point-in-time recovery for critical data

2. **Code Backups**:
   - Git repository serves as primary code backup
   - Regular commits to main branch

## 5. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Supabase URL and Key required" | Check environment variables in Vercel; ensure they're not empty |
| "Authentication redirect error" | Verify redirect URLs in Supabase Auth settings |
| "Database connection refused" | Check Supabase project status; verify IP allowlist |
| "Build fails" | Check build logs in Vercel; ensure Node version compatibility |

### Getting Help

- **Vercel Support**: [Vercel Documentation](https://vercel.com/docs)
- **Supabase Support**: [Supabase Discord](https://discord.supabase.com)
- **Project Issues**: Create an issue in the project repository

---

*Last updated: April 2026*