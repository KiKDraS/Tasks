# Agent Skills Rules

## Stack

Expo / React Native. Framework rules, commands, app map:
`docs/expo-react-native.md`. Prefer Expo modules over third-party libraries.

## Rules

**Caveman ON (full).** Sub-agents inherit. Off: "stop caveman". Spec:
`.opencode/skills/caveman/SKILL.md`

**Caveman ultra on meta edits.** `AGENTS.md` and `.opencode/agents/*.md`:
max compression, no prose, no explanations, no pleasantries.

**Context7 MCP enabled.** Key: `.opencode/secrets/context7-api-key`, loaded via `{file:...}` in
`opencode.json`. Use for library/framework/API docs. Spec:
`.opencode/skills/context7-mcp/SKILL.md`

**CodeGraph optional.** Use `codegraph_explore` when a `.codegraph/` index
exists; otherwise built-in Grep/Read.
