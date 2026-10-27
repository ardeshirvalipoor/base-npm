# @codesuma/baseline

## 1.2.3

### Patch Changes

- 6e1a3ac: Fix the children list going wrong when components move:

  - Appending a child that is already in the parent, to move it to the end, no longer lists it twice in `getChildren()`. A list that re-appended its items to sort them grew on every sort.
  - Moving a child to another parent takes it out of the old parent's list. Before, a later `empty()` on the old parent removed it from the new one.
  - `prepend(a, b)` and `appendAfter(ref, a, b)` keep the order of their arguments. Both used to put `b` before `a`.
  - `remove()` takes the component out of the document but leaves its own children in place, so it can be appended again as it was. Before, it emptied the component, and a removed card came back blank. Every component in the subtree still gets `unmounted`, and `mounted` again when it returns.

- c3de835: - `Button` click handlers now receive the click event, like every other component's DOM events. `Button` used to set `onclick` only to call `emit('click')` with no payload, so a handler that called `e.preventDefault()` threw. `btn.emit('click')` still calls the handlers.
  - `.off()` now removes a handler that was registered for more than one DOM event, such as `on(['mouseenter', 'focus'], h)`. Before, the handler kept firing on one of them. `.on()` now hands the handler itself to `addEventListener`, so the map of wrapped handlers is gone.
- 327a758: `http` sends `Content-Type: application/json` only when the request has a body. It used to send it on every request, GET and DELETE included. On a request to another domain, that header makes the browser send a preflight request before the real one, so each cross-origin GET cost two round trips. A `Content-Type` passed in `headers` still wins.
- 6b60dcb: `Page` starts its enter animation as soon as the old page has left, instead of 200 ms later. The wait dates from before the router awaited `exit` handlers: back then, the exit animation and the wait ran side by side. Since 1.2.0 the router waits for the exit to finish, so the two delays added up, and every navigation showed no page at all for 200 ms. A navigation now takes 320 ms instead of 520 ms.

  The wait also let an invisible slide finish, when a page moved from one hidden side to the other before entering. The page now jumps there with its transitions off, so the enter animation still starts from the right side: from below going forward, from above going back.

- 6e66166: Rewrite the README. It now shows how Baseline handles each job people pick a framework for, from reactivity and components to routing, data and animation, and ends with a full API reference. Every example compiles against the library. It also drops things the old README described that never existed, such as `CounterExample`, `helpers/style` and the `cache` route option.
- 2120c3c: Fix the first `back()` doing nothing on the page the app opened on. The router's first navigation, to the page the browser loaded, pushed a history entry for it although the browser already had one, so the history held two entries for the same path. Going back landed on the first of them, which the popstate handler ignores because the path has not changed, and it took a second `back()` to leave the page. This showed after any reload or deep link: an app that reloads itself to change its language had to be told to go back twice to leave the page it reloaded on. The first navigation now leaves the history as the browser loaded it.
- 7593164: Fix a double tap on a link pushing two history entries for the same page, so it took two `back()` calls to leave it. The second `goto()` started while the first was still waiting for the old page's exit animation, before the router had moved to the new path, so it passed the "already there" check and pushed again. Navigations now run one at a time: a `goto()` that comes during another one starts once that one has finished, and is ignored if it goes to the page that one landed on. This also means two quick taps on different links each exit their page before the next one enters.

  The back and forward buttons now pass their direction to the navigation directly, instead of through a shared flag that a later `goto()` could pick up.

- b7af9bd: - `index.ts` re-exports its types with `export type`. Compilers that work one file at a time, such as Vite, esbuild and swc, could not tell `IBaseComponent`, `IRouteEvent` and the other interfaces were types, so loading the package could fail there.
  - `idb`: a transaction that aborts without an error event, for example when storage is full at commit, now rejects its promise. Before, `save()`, `get()`, `find()` and the rest never settled in that case. Also removes a branch of the connection cache that no caller reached.
  - `state.clear()` now tells each key's subscribers that their value is gone, the way `state.remove()` does, before the `change` event with key `'*'`.
  - `initRipple()` called a second time no longer adds a second set of listeners, which showed two ripples per press.
  - `formatNumber()` no longer puts thousands separators in the decimals: `formatNumber(1234.5678, 4)` gives `1,234.5678`, not `1,234.5,678`.

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
