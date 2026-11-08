# Tasks

Expo/React Native school project for ISTEA Parcial 1: a local task manager with authentication, AsyncStorage persistence, and local notifications.

## Project structure

```text
src/
├── app/                  Expo Router routes: screens and layouts
│   ├── (tabs)/           authenticated tabs: home and task form
│   └── sign-up/          registration screen
├── components/           UI components
│   ├── icons/            cross-platform symbol wrappers
│   └── ui/               auth, form, header, home, task-form
├── constants/            theme tokens, routes, storage keys, time
├── context/              auth and tasks providers, types, seed data
├── hooks/                auth, task form, tasks, storage, DB, clock
└── utils/                id, date, delay

__tests__/                Jest + React Native Testing Library suites
assets/images/            app icon and test evidence
.github/                  pull request template
.opencode/                agents, commands, docs, plugins, skills
app.json                  Expo config and plugins
eslint.config.js          lint config
expo-env.d.ts             Expo type declarations
opencode.json             OpenCode instructions, permissions, MCP
package.json              scripts, dependencies, Jest config
pnpm-lock.yaml            dependency lockfile
pnpm-workspace.yaml       pnpm workspace config
skills-lock.json          installed skill registry
tsconfig.json             TypeScript config and `@/` alias
AGENTS.md                 agent roster, canonical sources, this tree
README.md                 Spanish delivery README
```

Generated, not edited by hand: `node_modules/`, `.expo/`, `dist/`, and native
`ios/` / `android/` directories when Expo creates them. Route rules and the
screen map live in `.opencode/docs/expo-react-native.md` §Navigation & Routing
and §Repo Notes.

## Agents

Authoritative roster. Each agent's behavior, permissions, and detailed instructions live in its file.

| Agent | Mode | Responsibility | Writes / owns | File |
| --- | --- | --- | --- | --- |
| `orchestrator` | primary | Intake, plan, delegate, enforce gates, request approval | No project files | `.opencode/agents/orchestrator.md` |
| `mobile-dev` | subagent | Implement approved Expo/React Native changes | `src/**`, `assets/**`, `app.json`, `package.json`, `tsconfig.json`, `eslint.config.js` | `.opencode/agents/mobile-dev.md` |
| `code-review` | subagent | Read-only audit of requirements, architecture, RN patterns, accessibility, tests, sync | No files | `.opencode/agents/code-review.md` |
| `qa-engineer` | subagent | Maintain Jest/RNTL tests, run the suite, verify notifications | `__tests__/**` | `.opencode/agents/qa-engineer.md` |
| `release-manager` | subagent | README, git lifecycle, PR, delivery checklist | `README.md`, git operations | `.opencode/agents/release-manager.md` |

Stage flow and gates: `.opencode/docs/pipeline.md`.

## Canonical sources

| Topic | Source |
| --- | --- |
| Expo/React Native rules, commands, app map | `.opencode/docs/expo-react-native.md` |
| Assignment requirements, acceptance checklist, accepted gaps | `.opencode/docs/project-brief.md` |
| Agent stages, gates, git flow | `.opencode/docs/pipeline.md` |
| Source-of-truth map and no-duplication policy | `.opencode/docs/directive-sync.md` |
| Review and test checklist | `.opencode/docs/quality-gates.md` |
| Skills rules: caveman, Context7, CodeGraph | `.opencode/docs/skills-settings-rules.md` |
| Knowledge-awareness rules | `.opencode/docs/agent-knowledge-awareness.md` |
| App behavior, data model, flows | `.opencode/docs/SPEC.md` |
| Visual tokens, components, layouts | `.opencode/docs/DESIGN.md` |
| Mobile accessibility checklist | `.opencode/skills/accessibility-mobile/SKILL.md` |
| Spanish UI copy and microcopy | `.opencode/skills/ux-writing/SKILL.md` |
| README delivery rules | `.opencode/skills/write-root-readme/SKILL.md` |
| PR checklist | `.github/PULL_REQUEST_TEMPLATE.md` |

Default agent: `orchestrator`. Agent files live in `.opencode/agents/`. Source-of-truth policy: `.opencode/docs/directive-sync.md`.
