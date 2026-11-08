// Session rules loader. Injects the plugin-owned rule docs plus project
// pointers into every model request, so rules apply from the first turn. V2
// resolves `opencode.json` `instructions` natively, so only these docs are
// injected here.
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Plugin } from "@opencode/plugin"

const docsDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "docs")
const FILES = ["skills-settings-rules.md", "agent-knowledge-awareness.md"]

const read = (path) => {
  try {
    return readFileSync(path, "utf8")
  } catch (error) {
    console.warn(`load-context: cannot read ${path}: ${error.message}`)
    return ""
  }
}

const caveman = read(join(docsDir, "..", "skills", "caveman", "SKILL.md"))
  .replace(/^---[\s\S]*?---\s*/, "")

const docs = FILES.flatMap((file) => {
  const path = join(docsDir, file)
  const text = read(path)
  return text ? [{ type: "text", text: `Instructions from: ${path}\n\n${text}` }] : []
})

if (caveman) docs.push({ type: "text", text: caveman })

const RULES = [
  "",
  "## Session rules (auto-loaded)",
  "- AGENTS.md + .opencode/docs/directive-sync.md + your agent file = law. Follow. No deviation.",
  "- Caveman mode: ON, full. See .opencode/skills/caveman/SKILL.md.",
  "- Stages, gates, git flow: .opencode/docs/pipeline.md.",
]
const MARKER = "## Session rules (auto-loaded)"

export default Plugin.define({
  id: "load-context",
  async setup(ctx) {
    await ctx.session.hook("context", (event) => {
      if (event.system.some((part) => String(part?.text ?? "").includes(MARKER))) return
      event.system.push(...docs, ...RULES.map((text) => ({ type: "text", text })))
    })
  },
})
