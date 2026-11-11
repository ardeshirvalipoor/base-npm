# @codesuma/create-baseline-app

## 1.0.7

### Patch Changes

- - The app is named after its folder. `create-baseline-app .` and `create-baseline-app apps/shop` wrote `.` and `apps/shop` as the name in `package.json` and in the titles of the AI files.
  - A flag such as `--help` prints the usage. It used to create a folder named `--help` and install into it.
  - `package.json` says the tool needs Node 18 or later.
  - New apps ask for `@codesuma/baseline` 1.3.0 or later. `AI_GUIDE.md` shows what that version adds: `style()` with custom properties, `attr(name, null)`, `addClass()` with conditions, and `BaseSVG`.
  - The package ships a `LICENSE` file.

## 1.0.6

### Patch Changes

- 55578e1: - `npm run serve` falls back to `index.html` for app routes, so reloading or opening `/about` directly no longer gives 404.
  - A type error now fails `npm run build`: the template's `tsconfig.json` sets `noEmitOnError`. Before, Rollup printed a warning and wrote the bundle anyway. Also drops `baseUrl`, which did nothing here and is deprecated in TypeScript 6.
  - New apps get a `CLAUDE.md` that imports `AGENTS.md`, a `verify` skill for AI agents, and `npm run web:stop`, which frees the dev server's port when a server is left running.
  - `index.html` keeps the browser's keyboard focus outlines and lets people zoom: it no longer sets `outline: none` on everything or `user-scalable=no`.
  - `AI_GUIDE.md` gives the right signatures for `A(href, text, target)`, `Img`, `Select`, `Canvas(width, height)` and `SVG(viewBox)`, says which events of `Input` and `Select` send their own payloads, and no longer says `remove()` clears a component's children.
  - The CLI copies image and font files from the template byte for byte. It used to read every file as text, which would corrupt them.

## 1.0.5

### Patch Changes

- 81effd9: Fix silently untranspiled TypeScript in scaffolded apps. Baseline ships raw `.ts`, and once its `node_modules` sources joined the TS program, the compiler's inferred common source directory shifted, so `@rollup/plugin-typescript`'s output lookup missed for early-loaded `src/` files — they passed through rollup untranspiled (a parse error on TS-only syntax like `window as any`, or silently unchecked code when it happened to parse as JS, which the starter code does). The template tsconfig now pins `"rootDir": "."` and includes `node_modules/@codesuma/baseline/**/*.ts` (with tests excluded) so emit paths stay stable from the first loaded module.

## 1.0.4

### Patch Changes

- baseline: split `text()`/`html()` out of `createStyler` into a new `createContent` mixin (also exported), add `emitter.emitAsync()` and use it so `router` actually awaits async `exit` handlers as documented, add `Page.showInstant()`/`exitDown()` to match the README, fix native components (`Div`/`Span`/`P`/`H1`-`H6`/`Button`/`A`/`SVG`) overriding `.text()`/`.html()` with non-chainable versions, isolate emitter handler errors, widen `append()`'s type to accept `Promise`-based children, dedupe `Base`/`BaseSVG`, remove dead `utils/mounter.ts`, and exclude test files from the published package.

  create-baseline-app: exclude baseline's test files from the template's rollup TypeScript include, matching the packaging fix above.
