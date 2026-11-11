# @codesuma/baseline

## 1.3.0

### Minor Changes

- Add the small things apps kept reaching past Baseline for:

  - `style()` sets CSS custom properties: `card.style({ '--accent': color })`. Before, this needed `card.el.style.setProperty('--accent', color)`. A value of `undefined` leaves the property as it is, as it does for every other property.
  - `attr(name, null)` removes an attribute.
  - `addClass()` and `removeClass()` skip empty and false values, so a condition can sit in the call: `row.addClass(styles.row, done && styles.done)`. An empty string used to throw, and `false` added a class named `false`.
  - A chain keeps the component's own type. The methods that chain now return `this`, so `Button('Save').addClass(styles.save).disable()` type-checks. `attr()` has separate signatures for reading and writing, so `attr('title')` is `string | null`.
  - `index.ts` exports `BaseSVG` and `IBaseSVGComponent`, for the parts inside an `SVG()`, and the `Input` types: `InputType`, `InputOptions`, `IInputComponent`, `ITextAreaComponent` and `ICheckboxComponent`.
  - The package ships a `LICENSE` file. `CONTRIBUTING.md` names the repository as it is now.

### Patch Changes

- Make the slow paths faster. The numbers are from Chrome 156 on a desktop, old and new code in the same run:

  - `empty()` and `destroy()` no longer slow down with the square of the list. Each child that left scanned its parent's whole list. Emptying 5,000 rows took 59 ms and now takes 10 ms. For 20,000 rows it went from 751 ms to 34 ms.
  - Making components is about 15% faster: 5,000 rows of three components took 45 ms and now take 38 ms. Every new component used to get a weak reference and a place in the set that waits for `mounted`, and nearly all of them left it a moment later. Now only a component that still has no parent at the end of the task gets one.
  - `formatDate()`, `formatTime()` and `formatCurrency()` keep one `Intl` formatter per locale, and per currency, instead of building one on every call. 2,000 calls of each took 205 ms and now take 4 ms. A formatter stays in the time zone it was built in, so the date ones are built again when the device's offset from UTC changes.
  - `idb.find()` going forward reads its items with one `getAll()` instead of a cursor step per item: 1,000 items by index took 9.9 ms and now take 4.6 ms. A reverse `find()` still uses the cursor.
  - `Page`: the browser no longer keeps a full-screen layer for each hidden page, because a page that has left is `visibility: hidden`.
  - `package.json` declares `sideEffects`, so every bundler leaves out the parts an app does not import. Before, only the starter's Rollup setting did. A counter app built with default settings went from 5.2 KB to 3.5 KB minified.

- Fix a round of bugs found by reading every file and testing each one:

  - `off(event)` with no handler, and `removeAllListeners()`, now take the browser's listeners off too. Before, a real click still called a handler that `off('click')` had removed. `destroy()` uses the same path.
  - `once()`: `emitAsync()` now waits for an async handler added with `once()`, so the router waits for `page.once('exit', ...)`. A `once()` handler that throws no longer stays on and runs again.
  - `remove()` clears `parent`. It used to keep pointing at the old parent.
  - A root added with `document.body.appendChild`, taken out with `remove()` and added again now gets `mounted` again. Before, it stayed unmounted, and children added to it later never got `mounted`.
  - `Input` of type `range` sets its starting value after `min`, `max` and `step`. The browser fits a range value to the limits it has at that moment, so `{ value: 150, max: 200 }` started at 100.
  - The router decodes route parameters. `/tags/سلام` gave `%D8%B3%D9%84%D8%A7%D9%85` as the value. A value that is badly encoded stays as it came. Encode a value again when you build a path from it.
  - `router.goto(path, data)` no longer leaves a blank screen when `data` holds something the browser cannot keep in the history, such as a function or a component. `history.pushState` threw after the old page had left. The entry now goes in without the data, with a warning in the console, and the new page still gets `data` in its `enter` event.
  - `http` no longer throws on a response that is marked as JSON and has an empty body, which servers often send after a DELETE. `data` is then an empty string.
  - `http` sends a body of `false`, `0` or `''`. Only `null` and `undefined` mean no body.
  - `http.upload()` sends the `headers` option. It ignored it. The file's own type still goes out as `Content-Type`, unless a header names another. A file with no type no longer sends an empty `Content-Type`.
  - `idb`: a request that fails now rejects with its error. It rejected with `null`, because the code read the transaction's error before the browser had set it.
  - `idb.save()` with a list stores nothing when one item cannot be stored. Before, the items ahead of the bad one were saved while the promise rejected.
  - `idb`: calls that come together on a closed database share one connection. Each used to open its own, and only the last was ever closed.
  - `initRipple()`: a tap held longer than 100 ms showed two ripples on a touch screen, because the browser sends a `mousedown` when the finger lifts. The ripple now listens to `pointerdown` alone, which comes once for a mouse, a finger or a pen. A disabled button does not ripple.
  - `isIOS()` and `isMobile()` in `helpers/device` are true on an iPad, which reports the user agent of a Mac.
  - `Page`: a page that has left is now `visibility: hidden`. Before, the Tab key still reached its buttons, and a field kept the keyboard focus after its page was gone. A field on such a page cannot take focus until the page enters again.

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
