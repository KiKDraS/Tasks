// Session rules loader. Injects the caveman skill body plus project pointers
// into every model request, so rules apply from the first turn. Content is
// read from canonical files at load time, not copied. V2 resolves
// `opencode.json` `instructions` natively, so docs are not injected here.
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Plugin } from "@opencode/plugin"

const skillsDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "skills")

const read = (path) => {
  try {
    return readFileSync(path, "utf8").replace(/^---[\s\S]*?---\s*/, "")
  } catch (error) {
    console.warn(`load-context: cannot read ${path}: ${error.message}`)
    return ""
  }
}

const caveman = read(join(skillsDir, "caveman", "SKILL.md"))

const RULES = [
  "",
  "## Session rules (auto-loaded)",
  "- Caveman mode: ON, full. Persist every response.",
  "",
  caveman,
  "## Project rules",
  "- AGENTS.md + .opencode/docs/directive-sync.md + your agent file = law. Follow. No deviation.",
  "- Stages, gates, git flow: .opencode/docs/pipeline.md.",
]
const MARKER = "## Session rules (auto-loaded)"

export default Plugin.define({
  id: "load-context",
  async setup(ctx) {
    await ctx.session.hook("context", (event) => {
      if (event.system.some((part) => String(part?.text ?? "").includes(MARKER))) return
      event.system.push(...RULES.map((text) => ({ type: "text", text })))
    })
  },
})
