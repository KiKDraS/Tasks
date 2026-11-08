# Performance-Reliability

## Objective

Low cognitive difficulty + high performance. Applies to new and changed code in
a PR; untouched legacy is out of scope. Binding for write (`mobile-dev`) and
review (`code-review`). Violation = REJECT.

## Project fit

- Expo SDK 57 local task manager; AsyncStorage tasks, Zustand store target.
- Task collections are usually small. Do not add Map/cache unless N is large or
  the lookup repeats in a loop/render.
- AsyncStorage writes are ordered; do not parallelize writes that depend on each
  other. `Promise.all` only for independent work.
- Prefer flat store selectors and small helpers over speculative caching.
- Contract = AGENTS.md + SPEC.md + DESIGN.md + stack-standards.md first; this
  doc refines, never overrides.

## Cognitive difficulty

- FLAT > nested. Depth ≤2. Deeper → extract fn.
- Early return. Guard first. Happy path flat.
- Named predicate. `const isTitleMissing = title.trim() === ""`. Never inline
  `if (title.trim() === "")`.
- Small fn. ≤20 lines. One job. Name = verb + noun.
- No clever. No one-liner golf, no trick ternary, no fancy reduce.
- Explicit > implicit. No hidden state, no surprise side-effect.
- One concern per fn. Layout XOR logic XOR IO.
- Obvious > clever. 3am reader must get it first pass.

## Performance (lookup)

- Lookup = Map/Set/object for LARGE-N or loop-nested lookups. NEVER
  `indexOf`/`find`/`includes` inside a loop = O(n²). REJECT. Build Map once,
  reuse.
- Bounded-small arrays (n ≤ ~10) may be scanned inline: O(n) with tiny constant
  is within norm. `new Set(arr)` build ≈ `arr.includes(x)` for small N — no win.
  Don't "fix" what's free.
- Dedupe = Set. Not `filter + indexOf`.
- Hoist a lookup out of a loop/render — one Map build, many reads — ONLY when N
  is large or the rebuild repeats inside a loop. Small-N per-render scan is fine.
- Static data → module const. Derived → cache ONLY if cache pays.
- Prefer `Promise.all` for independent async work. Keep sequential when the next
  call depends on the previous result.
- Big-O: O(1)/O(n) expected. Document only non-obvious complexity; O(n²) needs
  written justification.

## Write checklist (mobile-dev)

- [ ] Depth ≤2. Guard returns first.
- [ ] Predicates named. No inline magic condition.
- [ ] Fn ≤20 lines. One job. New/changed code only.
- [ ] Lookup via Map/Set for large N or loop-nested scans. Small-N inline scan
      OK (n ≤ ~10).
- [ ] Non-obvious Big-O documented; O(n²) justified.

## Review checklist (code-review)

- [ ] Array scan in loop for membership/key → REJECT. O(n²). Small-N inline scan
      (n ≤ ~10) OK.
- [ ] Nested >2, no guard return → REJECT.
- [ ] Inline magic predicate → REJECT. Name it.
- [ ] Large-N lookup rebuilt per call/render → REJECT. Hoist/cache.
- [ ] Clever golf → REJECT. Boring wins.

## Reject format

```text
[PERF-REL] file:line — problem. Fix: solution.
```

## Priority

Correctness first. Perf-reliability ≥ style. Both ≥ speed of writing.
