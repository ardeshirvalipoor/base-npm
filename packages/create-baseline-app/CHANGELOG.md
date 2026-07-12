# @codesuma/create-baseline-app

## 1.0.5

### Patch Changes

- 81effd9: Fix silently untranspiled TypeScript in scaffolded apps. Baseline ships raw `.ts`, and once its `node_modules` sources joined the TS program, the compiler's inferred common source directory shifted, so `@rollup/plugin-typescript`'s output lookup missed for early-loaded `src/` files — they passed through rollup untranspiled (a parse error on TS-only syntax like `window as any`, or silently unchecked code when it happened to parse as JS, which the starter code does). The template tsconfig now pins `"rootDir": "."` and includes `node_modules/@codesuma/baseline/**/*.ts` (with tests excluded) so emit paths stay stable from the first loaded module.

## 1.0.4

### Patch Changes

- baseline: split `text()`/`html()` out of `createStyler` into a new `createContent` mixin (also exported), add `emitter.emitAsync()` and use it so `router` actually awaits async `exit` handlers as documented, add `Page.showInstant()`/`exitDown()` to match the README, fix native components (`Div`/`Span`/`P`/`H1`-`H6`/`Button`/`A`/`SVG`) overriding `.text()`/`.html()` with non-chainable versions, isolate emitter handler errors, widen `append()`'s type to accept `Promise`-based children, dedupe `Base`/`BaseSVG`, remove dead `utils/mounter.ts`, and exclude test files from the published package.

  create-baseline-app: exclude baseline's test files from the template's rollup TypeScript include, matching the packaging fix above.
