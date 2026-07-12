# @codesuma/baseline

## 1.2.1

### Patch Changes

- 81effd9: Fix double-fired `change`/`input`/`keydown` on label-wrapped checkbox and radio inputs. The Input factory re-emitted the inner input's events with a `{ value, event }` payload, but `.on()` (proxyDomEvents) also attached a native listener on the label wrapper, which the same event bubbled to — so handlers ran twice, the second time with the raw DOM event, where a destructured `value` is `undefined` (silently reverting toggled state in handlers like `({ value }) => save(value)`). The forwarding handlers now sit on the wrapper element itself for bubbling events, which also blocks the duplicate native proxy (the `on<event>` property is set). Also `toggle()` now emits the same `{ value }` payload shape as a user-initiated change instead of a bare boolean.

## 1.2.0

### Minor Changes

- baseline: split `text()`/`html()` out of `createStyler` into a new `createContent` mixin (also exported), add `emitter.emitAsync()` and use it so `router` actually awaits async `exit` handlers as documented, add `Page.showInstant()`/`exitDown()` to match the README, fix native components (`Div`/`Span`/`P`/`H1`-`H6`/`Button`/`A`/`SVG`) overriding `.text()`/`.html()` with non-chainable versions, isolate emitter handler errors, widen `append()`'s type to accept `Promise`-based children, dedupe `Base`/`BaseSVG`, remove dead `utils/mounter.ts`, and exclude test files from the published package.

  create-baseline-app: exclude baseline's test files from the template's rollup TypeScript include, matching the packaging fix above.

## 1.1.0

### Minor Changes

- Refactor

## 1.0.19

### Patch Changes

- Test
