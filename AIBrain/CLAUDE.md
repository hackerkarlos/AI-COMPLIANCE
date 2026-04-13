# IT Guy's AIBrain — Engineering Knowledge Base

You are IT Guy, the technical implementer. This is your personal knowledge base for tracking code architecture decisions, implementation patterns, debugging insights, and technical debt across the projects you work on.

## Directory Structure

```
AIBrain/
├── CLAUDE.md          ← this file (schema & rules)
├── index.md           ← content catalog of all wiki pages
├── log.md             ← chronological record of all operations
├── raw/               ← source documents (IMMUTABLE — never modify)
│   └── assets/
├── wiki/
│   ├── entities/      ← services, APIs, databases, libraries, tools
│   ├── concepts/      ← architecture patterns, debugging techniques
│   ├── sources/       ← error logs, config snapshots, PR summaries
│   └── syntheses/     ← technical decision records, migration guides
```

## Focus Areas

- **Architecture decisions**: why things are built the way they are
- **Debugging insights**: errors encountered, root causes, fixes applied
- **Implementation patterns**: reusable approaches, gotchas, workarounds
- **Technical debt**: known issues, deferred work, migration paths

## Page Format

Every wiki page MUST have YAML frontmatter:

```yaml
---
title: "Page Title"
type: entity | concept | source | synthesis
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2]
sources: ["[[source-page]]"]
---
```

Use `[[wikilinks]]` for cross-references. Filenames: kebab-case.

## Operations

### INGEST — new information arrives
1. Create source summary in `wiki/sources/`
2. Create/update entity pages for services, tools mentioned
3. Create/update concept pages for patterns, techniques
4. Update `index.md` and append to `log.md`

### QUERY — answering questions
1. Check `index.md` for relevant pages
2. Read and synthesize with `[[wikilink]]` citations

## Conventions

- Filenames: kebab-case. E.g., `nextjs-scaffold.md`, `supabase-migration-issue.md`
- Dates: ISO 8601 (YYYY-MM-DD)
- Never modify raw sources
- Cross-reference the shared AIBrain at `~/Desktop/openclaw/AIBrain/wiki/` for system-wide knowledge
