---
name: context7-mcp
description: This skill should be used when the user asks about libraries, frameworks, API references, or needs code examples. Activates for setup questions, code generation involving libraries, or mentions of specific frameworks like React, Vue, Next.js, Prisma, Supabase, etc.
---

User asks libs/frameworks/API refs/code examples → fetch current docs via Context7. Never training-data answers.

## When to Use This Skill

Activate when user:

- Setup/config Q ("How do I configure Next.js middleware?")
- Code w/ libs ("Write a Prisma query for...")
- API refs ("What are the Supabase auth methods?")
- Framework mentions (React, Vue, Svelte, Express, Tailwind, etc.)

## How to Fetch Documentation

### Step 1: Resolve the Library ID

Call `resolve-library-id`:

- `libraryName`: lib name from user Q
- `query`: user full Q (better relevance ranking)

### Step 2: Select the Best Match

From resolution results:

- Exact/closest name match to user ask
- Higher benchmark score → better docs quality
- Version mentioned (e.g. "React 19") → prefer version-specific IDs

### Step 3: Fetch the Documentation

Call `query-docs`:

- `libraryId`: selected Context7 ID (e.g. `/vercel/next.js`)
- `query`: user specific Q, one concept only

Multi-concept Q (e.g. routing+auth+caching) → separate `query-docs` per concept, same libraryId. Exception: Q about concepts interacting → single query. Combined queries dilute ranking → shallow results per topic.

### Step 4: Use the Documentation

Into response:

- Answer user Q w/ current accurate info
- Relevant code examples from docs
- Cite lib version when relevant

## Guidelines

- **Be specific**: user full Q as query, best results. One concept per query.
- **One topic per query**: split multi-topic Q → separate `query-docs`. Resolve library ID once → query per concept. Exception: Q about concepts interacting.
- **Version awareness**: version mentioned ("Next.js 15", "React 19") → version-specific IDs if available from resolution
- **Prefer official sources**: multiple matches → official/primary over community forks
