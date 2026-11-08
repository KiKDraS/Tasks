# Tasks

Expo/React Native school project for ISTEA Parcial 1 + 2: a local task manager with authentication, AsyncStorage persistence, local notifications, device resources (camera, gallery, location, contacts, calendar), and Zustand global state.

## Project structure

Place new files by intent, not by copying the current tree. The tree marks
ownership boundaries; the table decides the destination.

```text
src/
├── app/          ROUTES — screens, layouts, route groups
├── components/   REUSABLE UI
│   ├── icons/    platform symbol wrappers
│   └── ui/       feature-grouped components
├── constants/    STATIC CONFIG — tokens, routes, keys, time
├── context/      REACT CONTEXT — provider-bound state (auth; legacy tasks)
├── stores/       GLOBAL STATE — Zustand stores, selectors, actions
├── services/     SERVICES — device APIs, storage adapters
├── hooks/        REUSABLE BEHAVIOR — stateful logic, no JSX
└── utils/        PURE HELPERS — no React, no Expo

__tests__/        TESTS — one file per unit
assets/images/    STATIC IMAGES — icon and test evidence
.github/          GITHUB META — PR template
.opencode/        AGENT META — agents, commands, docs, plugins, skills
```

| Adding... | Destination | Rule |
| --- | --- | --- |
| A screen or route | `src/app/` | Every file is a route. `_layout.tsx` is a navigator; route groups use `(...)`. Keep non-route code outside. |
| A layout or navigator | `src/app/**/_layout.tsx` | One layout per route group. No screen UI inside. |
| A reusable component | `src/components/ui/<feature>/` | Group by feature (`home`, `auth`, `form`, `task-form`). Shared primitives at `src/components/ui/`. |
| An icon wrapper | `src/components/icons/<Name>Icon.tsx` | Map iOS/Android symbols through `icons/base/BaseIcon`. One icon per file. |
| A design token | `src/constants/theme.ts` | Colors, type, spacing, radius, shadow only. |
| A route, key, or time constant | `src/constants/` | `routes.ts`, `storage-keys.ts`, `time.ts`. No component logic. |
| Global state | `src/stores/<domain>/` | Zustand store. State, actions, selectors. Components read and write through store hooks; no prop drilling. |
| React context | `src/context/<domain>/` | Provider-bound state only (auth session). Types in `types/`, seed in `data/`, pure helpers in `utils/`. |
| A device integration | `src/services/<resource>.ts` | Wrap Expo APIs (`expo-image-picker`, `expo-location`, `expo-contacts/legacy`, `expo-calendar/legacy`). Return typed results and permission state. No JSX. |
| A storage adapter | `src/services/<domain>-storage.ts` | AsyncStorage read/write for a store. No React, no JSX. |
| A permission notice | `src/components/ui/permissions/` | Denied/blocked message, retry, settings link. Reuse `ThemedText` and `FormButton`. |
| A reusable hook | `src/hooks/<domain>/use-<thing>.ts` | Stateful/React logic only. No JSX. Form hooks live under their form domain. |
| A pure helper | `src/utils/` | No React, no Expo, no app state. |
| A test | `__tests__/<unit>-test.ts(x)` | Jest + RNTL. Match the unit name. |
| An agent definition | `.opencode/agents/<id>.md` | One role per file. Permissions and pointers only. |
| A shared rule or spec | `.opencode/docs/` | Canonical source. Link it; do not copy it into an agent file. |
| A slash command | `.opencode/commands/<id>.md` | Commands call skills or print references. |
| A skill | `.opencode/skills/<id>/SKILL.md` | One skill per directory; optional `references/` and `templates/`. |
| A plugin | `.opencode/plugins/<id>.js` | OpenCode plugin API only. |
| App or native config | `app.json` | Expo config and plugins. Never edit generated native folders. |
| Native permission strings | `app.json` | Camera, gallery, location, contacts, calendar usage text. Build a new binary after changes. |
| A dependency or script | `package.json` | Use `pnpm`; commit `pnpm-lock.yaml`. |
| Delivery docs | `README.md` | Spanish, delivery-facing. Behavior → `.opencode/docs/SPEC.md`, visuals → `.opencode/docs/DESIGN.md`. |
| GitHub meta | `.github/` | PR and issue templates only. |

Generated, never edited: `node_modules/`, `.expo/`, `dist/`, `ios/`, `android/`.
Route rules and the screen map: `.opencode/docs/expo-react-native.md`
§Navigation & Routing and §Repo Notes.

## Agents

Authoritative roster. Each agent's behavior, permissions, and detailed instructions live in its file.

| Agent | Mode | Responsibility | Writes / owns | File |
| --- | --- | --- | --- | --- |
| `orchestrator` | primary | Intake, plan, delegate app code, own OpenCode and requirement docs, enforce gates, request approval | `AGENTS.md`, `opencode.json`, `.opencode/{docs,agents,commands,skills,plugins}/**` | `.opencode/agents/orchestrator.md` |
| `mobile-dev` | subagent | Implement approved Expo/React Native changes | `src/**`, `assets/**`, `app.json`, `package.json`, `tsconfig.json`, `eslint.config.js` | `.opencode/agents/mobile-dev.md` |
| `code-review` | subagent | Read-only audit of requirements, architecture, RN patterns, accessibility, tests, sync | No files | `.opencode/agents/code-review.md` |
| `qa-engineer` | subagent | Maintain Jest/RNTL tests, run the suite, verify notifications | `__tests__/**` | `.opencode/agents/qa-engineer.md` |
| `release-manager` | subagent | README, git lifecycle, PR, delivery checklist | `README.md`, git operations | `.opencode/agents/release-manager.md` |

Stage flow and gates: `.opencode/docs/pipeline.md`.

## Canonical sources

| Topic | Source |
| --- | --- |
| Expo/React Native rules, commands, app map | `.opencode/docs/expo-react-native.md` |
| Parcial 1 + 2 requirements, acceptance checklist, accepted gaps | `.opencode/docs/project-brief.md` |
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
