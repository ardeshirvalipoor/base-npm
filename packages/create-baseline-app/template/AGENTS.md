## Project Rules

Before making any changes, read and follow `AI_GUIDE.md` in the project root.

### Critical Rules
- Factory functions only — no `class` or `extends`
- **Reach for the Baseline API first.** Whenever Baseline provides an equivalent, use it instead of raw JS / DOM / web APIs. That covers element creation (`Div`/`Button`/`Input`/`Base('tag')` over `document.createElement`), events (`.on()` over `addEventListener`), tree (`.append`/`.empty`/`.remove` over `el.appendChild`/`innerHTML=''`), classes (`.addClass`/`.toggleClass` over `el.className=`), text/attrs/styles (`.text`/`.attr`/`.style` over `el.textContent`/`setAttribute`/`el.style.x=`), storage (`ldb`/`idb` over `localStorage`/`indexedDB`), fetch (`http` over `fetch`), and shared state (`state` over ad-hoc globals). Drop to raw JS only at boundaries Baseline doesn't cover (DOM measurements, `IntersectionObserver`, `Clipboard`, etc.).
- Use emitter pattern (emit/on) for component communication — no callback options
- One `.module.css` per component — no monolithic CSS files
- Keep files focused. When a component file grows past ~200 lines or mixes two clear concerns (e.g. a list and its row, or rendering and pure data-shaping), split it: sibling files in the same folder, sharing the `.module.css`. Prefer many small focused files over one large file.
- Do NOT add runtime dependencies beyond `@codesuma/baseline`
