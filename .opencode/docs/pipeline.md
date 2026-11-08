# Agent Pipeline

Canonical stage flow and gates. Agent permissions live in `.opencode/agents/*.md`; quality rules in `quality-gates.md`; source-of-truth policy in `directive-sync.md`.

## Roles

Authoritative roster: `AGENTS.md` §Agents. Agent permissions: `.opencode/agents/*.md`.

## Stages

0. **Intake** — `orchestrator` reads the canonical sources and the current repo state. Ask the user when a requirement is ambiguous.
1. **Plan** — `orchestrator` produces a concrete plan: goal, files, acceptance criteria, test impact, branch name, open questions. Wait for explicit user approval (`Approved` / `Aprobado`). No implementation before approval.
2. **Build** — `mobile-dev` implements on `feature/<slug>` or `fix/<slug>`. Run the checks required by `.opencode/docs/expo-react-native.md` and the test command in `quality-gates.md`. Report changed files, commands, and results.
3. **Review** — `code-review` audits read-only against `quality-gates.md`. `STATUS: REJECTED` returns findings to `mobile-dev`; `STATUS: APPROVED` advances.
4. **QA** — `qa-engineer` verifies or extends the Jest/RNTL suite and runs it. Real product bugs return to `mobile-dev`; test gaps stay with `qa-engineer`.
5. **Release** — `release-manager` verifies delivery items and handles the git lifecycle. Wait for explicit user approval before merging to `main`.

## Gates

- **Code change:** `code-review` APPROVED + `qa-engineer` tests pass + the checks in `.opencode/docs/expo-react-native.md` §Commands pass.
- **Docs/meta change:** human review only; no code review or QA required.
- **Release:** user approval before merge, tag, or push to `main`.

## Git

- `main` is the deliverable branch.
- Work on `feature/<slug>` or `fix/<slug>`.
- No force pushes. No direct agent commits to `main`.
- PR is optional; if used, `release-manager` creates it and reports the URL.
- Merge to `main` only after the gates and explicit user approval.

## Handoff format

Every stage reports:

```text
STAGE: <intake|plan|build|review|qa|release>
STATUS: <done|blocked|approved|rejected>
FILES: <changed or reviewed>
COMMANDS: <run and results>
FINDINGS: <none or list>
NEXT: <next agent or user action>
```

## Failure loops

- Review rejected → `mobile-dev` fixes → review again.
- QA finds a product bug → `mobile-dev` fixes → QA again.
- QA finds a test gap → `qa-engineer` fixes → QA again.
- Release rejected by user → `orchestrator` revises the plan.

## Testing

Testing is defined in `.opencode/docs/quality-gates.md`; requirements are in `.opencode/docs/project-brief.md`.
