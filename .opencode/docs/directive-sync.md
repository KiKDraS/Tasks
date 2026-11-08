# Directive Sync

Canonical source-of-truth policy for this repo.

## No rule copies

- Agent files and meta files reference docs by pointer. Never copy rules, commands, requirements, checklists, or git flow into an agent file.
- Edit the canonical source only. A copy is stale by definition.
- Agent files contain role-specific instructions, permissions, and pointers; shared rules live in the sources below.
- Before reporting Done, verify every bound doc was read this run. Missing a doc → read it before continuing.
- A duplicated rule or a missing bound-doc read is a `[SYNC]` violation. `code-review` rejects it.

## Canonical sources

| Scope | Source |
| --- | --- |
| Expo/React Native rules, commands, app map | `.opencode/docs/expo-react-native.md` |
| Assignment requirements, acceptance checklist, accepted gaps, manual QA | `.opencode/docs/project-brief.md` |
| Stage flow, gates, git flow, handoff format | `.opencode/docs/pipeline.md` |
| Review/test checklist and test conventions | `.opencode/docs/quality-gates.md` |
| TypeScript, composition, component hygiene standards | `.opencode/docs/stack-standards.md` |
| Skills rules: caveman, Context7, CodeGraph | `.opencode/docs/skills-settings-rules.md` |
| Knowledge-awareness rules | `.opencode/docs/agent-knowledge-awareness.md` |
| Agent roster and responsibilities | `AGENTS.md` |
| App behavior, data model, flows | `.opencode/docs/SPEC.md` |
| Visual tokens, components, layouts | `.opencode/docs/DESIGN.md` |
| Mobile accessibility checklist | `.opencode/skills/accessibility-mobile/SKILL.md` |
| Spanish UI copy and microcopy | `.opencode/skills/ux-writing/SKILL.md` |
| README delivery rules | `.opencode/skills/write-root-readme/SKILL.md` |
| Agent-specific behavior and permissions | `.opencode/agents/<id>.md` |

## Binding

`opencode.json` auto-loads `.opencode/docs/expo-react-native.md`, `.opencode/docs/project-brief.md`, `.opencode/docs/pipeline.md`, `.opencode/docs/directive-sync.md`, and `.opencode/docs/stack-standards.md` for every agent. `.opencode/plugins/load-context.js` injects `.opencode/docs/skills-settings-rules.md` and `.opencode/docs/agent-knowledge-awareness.md` on every model request. Read the additional docs below before acting.

| Agent | Additional reads |
| --- | --- |
| `orchestrator` | `.opencode/docs/SPEC.md`, `.opencode/docs/DESIGN.md` |
| `mobile-dev` | `.opencode/docs/quality-gates.md`, `.opencode/docs/SPEC.md`, `.opencode/docs/DESIGN.md` |
| `code-review` | `.opencode/docs/quality-gates.md`, `.opencode/docs/SPEC.md`, `.opencode/docs/DESIGN.md` |
| `qa-engineer` | `.opencode/docs/quality-gates.md`, `.opencode/docs/SPEC.md` |
| `release-manager` | `README.md` |

Skills are loaded through the Skill tool. Agent files bind the skill they own; this table stays doc-only.

## Change policy

- Rule change: edit its canonical source in the same run.
- Agent file change: keep it role-specific; add a pointer if a shared rule is needed.
- After a source change, affected agents apply the new rule on their next run; no deferred copies.
