# Tasks

Expo/React Native school project for ISTEA Parcial 1: a local task manager with authentication, AsyncStorage persistence, and local notifications.

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
