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
| Expo/React Native rules, commands, app map | `docs/expo-react-native.md` |
| Assignment requirements, acceptance checklist, accepted gaps, manual QA | `docs/project-brief.md` |
| Stage flow, gates, git flow, handoff format | `.opencode/docs/pipeline.md` |
| Review/test checklist and test conventions | `.opencode/docs/quality-gates.md` |
| Skills rules: caveman, Context7, CodeGraph | `.opencode/docs/skills-settings-rules.md` |
| Knowledge-awareness rules | `.opencode/docs/agent-knowledge-awareness.md` |
| Agent-specific behavior and permissions | `.opencode/agents/<id>.md` |

## Binding

`opencode.json` auto-loads `docs/expo-react-native.md`, `docs/project-brief.md`, `.opencode/docs/pipeline.md`, and `.opencode/docs/directive-sync.md` for every agent. `.opencode/plugins/load-context.js` injects `.opencode/docs/skills-settings-rules.md` and `.opencode/docs/agent-knowledge-awareness.md` on every model request. Read the additional docs below before acting.

| Agent | Additional reads |
| --- | --- |
| `orchestrator` | none |
| `mobile-dev` | `.opencode/docs/quality-gates.md` |
| `code-review` | `.opencode/docs/quality-gates.md` |
| `qa-engineer` | `.opencode/docs/quality-gates.md` |
| `release-manager` | `README.md` |

## Change policy

- Rule change: edit its canonical source in the same run.
- Agent file change: keep it role-specific; add a pointer if a shared rule is needed.
- After a source change, affected agents apply the new rule on their next run; no deferred copies.
