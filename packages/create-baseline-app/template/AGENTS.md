## Project Rules

Before making any changes, read and follow `AI_GUIDE.md` in the project root.

### Critical Rules
- Factory functions only — no `class` or `extends`
- Use Baseline's `.on()` for DOM events — never `el.addEventListener`
- Use emitter pattern (emit/on) for component communication — no callback options
- One `.module.css` per component — no monolithic CSS files
- Do NOT add runtime dependencies beyond `@codesuma/baseline`
