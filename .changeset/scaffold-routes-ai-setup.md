---
"@codesuma/create-baseline-app": patch
---

- `npm run serve` falls back to `index.html` for app routes, so reloading or opening `/about` directly no longer gives 404.
- A type error now fails `npm run build`: the template's `tsconfig.json` sets `noEmitOnError`. Before, Rollup printed a warning and wrote the bundle anyway. Also drops `baseUrl`, which did nothing here and is deprecated in TypeScript 6.
- New apps get a `CLAUDE.md` that imports `AGENTS.md`, a `verify` skill for AI agents, and `npm run web:stop`, which frees the dev server's port when a server is left running.
- `index.html` keeps the browser's keyboard focus outlines and lets people zoom: it no longer sets `outline: none` on everything or `user-scalable=no`.
- `AI_GUIDE.md` gives the right signatures for `A(href, text, target)`, `Img`, `Select`, `Canvas(width, height)` and `SVG(viewBox)`, says which events of `Input` and `Select` send their own payloads, and no longer says `remove()` clears a component's children.
- The CLI copies image and font files from the template byte for byte. It used to read every file as text, which would corrupt them.
