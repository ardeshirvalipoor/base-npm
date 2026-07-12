## Project Rules

Before making any changes, read and follow `AI_GUIDE.md` in the project root.

### Critical Rules
- Factory functions only — no `class` or `extends`
- **Reach for the Baseline API first.** Whenever Baseline provides an equivalent, use it instead of raw JS / DOM / web APIs. That covers element creation (`Div`/`Button`/`Input`/`Base('tag')` over `document.createElement`), events (`.on()` over `addEventListener`), tree (`.append`/`.empty`/`.remove` over `el.appendChild`/`innerHTML=''`), classes (`.addClass`/`.toggleClass` over `el.className=`), text/attrs/styles (`.text`/`.attr`/`.style` over `el.textContent`/`setAttribute`/`el.style.x=`), storage (`ldb`/`idb` over `localStorage`/`indexedDB`), fetch (`http` over `fetch`), and shared state (`state` over ad-hoc globals). Drop to raw JS only at boundaries Baseline doesn't cover (DOM measurements, `IntersectionObserver`, `Clipboard`, etc.).
- **Below Baseline, use the platform's idiomatic solution.** When code legitimately drops to raw DOM / CSS / web APIs, reach for the current, purpose-built feature — not a legacy pattern, and not a JS re-implementation of something the platform does natively. Pointer Events (+ `setPointerCapture`, CSS `touch-action`) over paired `touch*`/`mouse*` handlers; CSS `currentColor`/`inherit`/custom properties over reading computed styles from JS; `aspect-ratio` over padding hacks; `dvh` (with `vh` fallback) over `100vh`; flex/grid `gap` over margin arithmetic. See the platform-idiomatic cheat sheet in `AI_GUIDE.md`.
- Use emitter pattern (emit/on) for component communication — no callback options
- One `.module.css` per component — no monolithic CSS files
- Keep files focused. When a component file grows past ~200 lines or mixes two clear concerns (e.g. a list and its row, or rendering and pure data-shaping), split it: sibling files in the same folder, sharing the `.module.css`. Prefer many small focused files over one large file.
- Do NOT add runtime dependencies beyond `@codesuma/baseline`
