---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

<!-- MODIFIED: token-compressed, semantics preserved. License: Apache-2.0. -->

Guides creation of distinctive, production-grade frontend interfaces avoiding generic "AI slop" aesthetics. Implement real working code w/ exceptional attention to aesthetic details + creative choices.

User provides frontend requirements: component, page, application, or interface to build. May include context: purpose, audience, technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Many flavors. Use as inspiration only — design one true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? The one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Beautiful, unique, interesting fonts. Avoid generic Arial/Inter; distinctive choices elevate aesthetics. Unexpected, characterful choices. Pair distinctive display font + refined body font.
- **Color & Theme**: Commit to cohesive aesthetic. CSS variables for consistency. Dominant colors w/ sharp accents beat timid, evenly-distributed palettes.
- **Motion**: Animations for effects + micro-interactions. CSS-only first for HTML. Motion library for React when available. High-impact moments: one well-orchestrated page load w/ staggered reveals (animation-delay) delights more than scattered micro-interactions. Use scroll-triggering + hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Atmosphere + depth over solid colors. Contextual effects + textures matching the aesthetic. Creative forms: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays.

NEVER generic AI aesthetics: overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts + component patterns, cookie-cutter design lacking context-specific character.

Interpret creatively. Unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, e.g.) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code w/ extensive animations + effects. Minimalist or refined designs need restraint, precision, careful attention to spacing, typography, subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

> **Project contract:** This project has a `DESIGN.md` at the root directory.
> Read it before generating any code. Every design decision — color, type,
> spacing, motion, atmosphere — must conform to the contract defined there.
> If `DESIGN.md` does not exist yet, the design direction has not been
> established and must be agreed upon with the user before writing code.
