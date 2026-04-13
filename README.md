# EUComply - AI-Powered EU Compliance Tool

EUComply is an AI-driven compliance platform that helps Danish SMBs navigate EU regulations (GDPR, Bogføringsloven, NIS2, ePrivacy, AI Act). The tool provides automated assessments, actionable recommendations, and compliance dashboards.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Database & Auth**: Supabase (PostgreSQL, Auth)
- **Package Manager**: pnpm
- **AI Integration**: Anthropic Claude API (Haiku/Sonnet)
- **Deployment**: Vercel (recommended)

## Features

- **Regulation Assessment**: AI-powered compliance checks across multiple EU regulations
- **Dashboard**: Real-time compliance scores and progress tracking
- **Action Plans**: Step-by-step guidance to address compliance gaps
- **Secure Authentication**: Magic link authentication via Supabase Auth
- **Multi-tenant**: Support for multiple organizations and users
- **API Integration**: RESTful API for external integrations

## Getting Started

### Prerequisites

- Node.js 20+ (recommended 22.x)
- pnpm 10.x (`npm install -g pnpm`)
- Supabase account and project
- Anthropic API key (for AI assessments)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/eucomply.git
   cd eucomply
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables (see [Environment Variables](#environment-variables) section).

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3100` (port 3100 due to Mission Control environment).

5. **Run type checking**
   ```bash
   pnpm typecheck
   ```

6. **Lint the code**
   ```bash
   pnpm lint
   ```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id

# AI - Claude API (used server-side only)
ANTHROPIC_API_KEY=your-anthropic-api-key

# Mission Control (optional - for task tracking)
MC_URL=http://127.0.0.1:3002
MC_API_KEY=your-mc-api-key
```

**Note**: Never commit `.env.local` to version control. The `.env.example` file serves as a template.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server (port 3100) with webpack |
| `pnpm dev:turbo` | Start with Turbopack (currently blocked by MC env) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typegen` | Generate route types for typedRoutes |
| `pnpm typecheck` | Run TypeScript type checking |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Public pages (landing, pricing)
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API route handlers
│   └── onboarding/        # Onboarding flow
├── components/            # React components
│   ├── ui/                # Reusable UI primitives
│   ├── onboarding/        # Wizard components
│   ├── dashboard/         # Dashboard components
│   └── assessment/        # Assessment components
├── lib/                   # Utilities and shared logic
│   ├── supabase/          # Supabase clients (browser, server)
│   ├── ai/                # AI integration (client, classifier, assessor)
│   ├── ai/prompts/        # Prompt templates per regulation
│   └── regulations/       # Regulation metadata and checklists
└── types/                 # TypeScript type definitions
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel, Supabase project setup, and DNS configuration.

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Check Mission Control** for assigned tasks (project ID: 2, prefix: CPLY)
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Follow coding conventions** as defined in [CLAUDE.md](./CLAUDE.md)
4. **Write tests** for new functionality
5. **Update documentation** when changing features
6. **Commit with conventional commit messages**
   ```bash
   git commit -m "feat(scope): description"
   ```
7. **Push and create a pull request**

### Coding Standards

- **TypeScript**: Strict mode enabled, explicit types preferred
- **Components**: Server components by default, client components only when needed
- **Styling**: Tailwind CSS utility classes, avoid custom CSS
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Group imports (external, internal, type imports)
- **Error handling**: Use try/catch with proper error logging

### Testing

- **Unit tests**: Vitest for component and utility testing
- **Integration tests**: Vitest for API routes and services
- **E2E tests**: Playwright for critical user flows
- **Run tests**: `pnpm test` (unit), `pnpm test:e2e` (E2E)

## License

Proprietary - All rights reserved.