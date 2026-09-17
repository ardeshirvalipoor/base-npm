# @codesuma/baseline

## 1.2.2

### Patch Changes

- 1ad4384: - `idb`: a cached connection now closes itself on `versionchange`, so a store upgrade requested from another tab is no longer held up until this tab's idle timer closes the connection. The next call reopens at the new version.
  - `http.get`: concurrent requests are deduplicated by URL together with `auth` and `headers`, not by URL alone, so two GETs with different tokens no longer share one response.
  - Components waiting to enter the document are held weakly, so one that is built and never appended anywhere is no longer checked on every DOM mutation for the life of the page.
- 1ad4384: Fix the router carrying `isBack` into the next navigation after a `popstate` that lands on the current path. The popstate handler set `isBackNavigation` before checking whether the path had changed, and only `navigate()` cleared it, so an entry the app had pushed itself for a query change on the same route (a two-panel layout opening a second item beside a list) left the flag set once the user went back. The next `goto()` was then treated as a back navigation: no `pushState`, the address stayed put, and a later `back()` skipped the page the user expected to return to. The flag is now set only when the popstate actually navigates.

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
