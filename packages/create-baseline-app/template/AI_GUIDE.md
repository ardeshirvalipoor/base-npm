# AI Agent Guide for {{PROJECT_NAME}}

> Read this before making any changes to the project.

## Project Overview

A SPA built with the [Baseline](https://www.npmjs.com/package/@codesuma/baseline) framework. No React, no Vue, no virtual DOM — just factory functions, direct DOM manipulation, and an event emitter.

## Tech Stack

- **Framework:** `@codesuma/baseline` (imperative, zero-dependency UI framework)
- **Language:** TypeScript (strict mode)
- **Bundler:** Rollup (with postcss for CSS Modules, terser for minification)
- **Styling:** CSS Modules (`.module.css` files, scoped class names)
- **Dev server:** `http-server` on port 3000

## Architecture Principles (MUST follow)

1. **Factory functions, not classes** — All components are plain functions returning Baseline components
2. **Composition via `Object.assign`** — Extend components by assigning new methods
3. **Emitter pattern for communication** — Children emit events, parents listen. No callback options.
4. **CSS Modules for styling** — One `.module.css` per component, imported as `styles`
5. **Direct DOM only** — No virtual DOM, no reactivity, no state management libraries
6. **Explicit over implicit** — No hidden state, no magic bindings

## Constraints (MUST NOT violate)

- Do NOT add React/Vue/Svelte patterns (hooks, refs, signals, JSX)
- Do NOT use `class` or `extends`
- Do NOT add runtime dependencies beyond `@codesuma/baseline`
- **Reach for the Baseline API first.** When Baseline ships an idiomatic equivalent for what you'd otherwise write with raw JS or the raw DOM, use the Baseline one. This is the single most common mistake — falling back to `document.createElement`, `addEventListener`, `el.className =`, `localStorage`, raw `fetch`, or ad-hoc globals when there's already a baseline answer. See the [Baseline-first cheat sheet](#baseline-first-cheat-sheet) below.
- Do NOT use callback options for component communication — use the emitter pattern (`emit`/`on`)

## File Organization

```
{{PROJECT_NAME}}/
└── src/
    ├── index.ts             # Entry point — mounts app to document.body
    ├── app.ts               # App shell — router setup, view container
    ├── css-modules.d.ts     # Generic TS declaration for *.module.css imports
    ├── components/          # Reusable UI components
    │   ├── index.ts         # Barrel — re-exports all components
    │   └── my-component/
    │       ├── index.ts     
    │       └── index.module.css
    ├── pages/               # Top-level pages mounted by router
    │   ├── home/index.ts    
    │   └── about/index.ts   
    └── services/            # Pure logic, API calls, state
```

## Baseline-first cheat sheet

The single biggest source of non-idiomatic code is reaching for raw JS / DOM / web APIs when Baseline already has the answer. Default to the Baseline equivalent; only drop to raw JS at boundaries Baseline doesn't cover (DOM measurements, observers, file/clipboard APIs, etc.).

### Equivalents at a glance

| Concern               | Raw JS / DOM (avoid)                                  | Baseline (use)                                                      |
|-----------------------|--------------------------------------------------------|---------------------------------------------------------------------|
| Element creation      | `document.createElement('div')`                        | `Div()` / `Button()` / `Input(...)` / … or `Base('tag')` for niche tags |
| Event listener        | `el.addEventListener('click', h)`                      | `c.on('click', h)`                                                  |
| Remove listener       | `el.removeEventListener(...)`                          | `c.off('click', h)`                                                 |
| Append child          | `parent.el.appendChild(child.el)`                      | `parent.append(child)`                                              |
| Insert before / after | `parent.el.insertBefore(...)`                          | `parent.appendBefore(ref, c)` / `appendAfter(ref, c)` / `prepend(c)` |
| Clear children        | `el.innerHTML = ''`                                    | `c.empty()`                                                         |
| Detach element        | `el.remove()` (raw)                                    | `c.remove()` (also fires `unmounted`, cleans children)              |
| Class manipulation    | `el.className = 'x'` / `classList.add/remove/toggle`   | `c.addClass(x)` / `removeClass(x)` / `toggleClass(x, on?)`          |
| Text content          | `el.textContent = 'x'`                                 | `c.text('x')`                                                       |
| HTML content          | `el.innerHTML = '<b>x</b>'`                            | `c.html('<b>x</b>')`                                                |
| Attribute             | `el.setAttribute('data-x', 'y')` / `getAttribute(...)` | `c.attr('data-x', 'y')` / `c.attr('data-x')`                        |
| Inline style          | `el.style.color = 'red'`                               | `c.style({ color: 'red' })`                                         |
| Component event bus   | callbacks in options / ad-hoc emitter                  | `c.emit('save', payload)` + `parent.on('save', h)`                  |
| Local storage         | `localStorage.setItem` / `getItem` (+ manual JSON)     | `ldb.set(key, obj)` / `ldb.get(key)`                                |
| IndexedDB             | raw `indexedDB...` boilerplate                         | `idb('app').save(store, item)` / `.find(store, query)` / `.get(...)` |
| HTTP                  | `fetch('/api/x').then(r => r.json())`                  | `await http.get('/api/x')` (with request dedup)                     |
| Cross-component state | window globals, ad-hoc event buses                     | `state.set(k, v)` / `state.get(k)` / `state.on(k, h)`               |
| SPA navigation        | `history.pushState` + manual handlers                  | `router.goto('/path')` / `router.on('change', h)`                   |

### Native HTML elements: factory list

Always reach for these so the resulting element gets `.on()`, `.addClass()`, `.append()`, `.emit()`, lifecycle events, and integrates cleanly with Baseline parents.

| Tag(s)                  | Factory                                                                                              |
|-------------------------|------------------------------------------------------------------------------------------------------|
| `<div>`                 | `Div(text?)`                                                                                         |
| `<span>`                | `Span(text?)`                                                                                        |
| `<p>`                   | `P(text?)`                                                                                           |
| `<h1>`–`<h6>`           | `H1` … `H6`                                                                                          |
| `<button>`              | `Button(text?)`                                                                                      |
| `<input>` / `<textarea>`| `Input(placeholder?, type?, options?)` — supports `'text'`, `'color'`, `'checkbox'`, `'textarea'`, etc. |
| `<a>`                   | `A(text?, href?)`                                                                                    |
| `<img>`                 | `Img(src?)`                                                                                          |
| `<select>` / `<option>` | `Select` / `Option`                                                                                  |
| `<canvas>`              | `Canvas()`                                                                                           |
| `<svg>`                 | `SVG()`                                                                                              |

For tags without a dedicated factory, drop down to `Base('tag')` — you still get the full mixin set:

```typescript
import { Base } from '@codesuma/baseline'

const figure = Base('figure')
figure.addClass(styles.figure)
figure.on('click', () => ...)
```

### Antipattern → idiomatic

Mixing raw DOM into a Baseline component is the most common mistake. Side by side:

```typescript
// ❌ Antipattern — bypasses every Baseline affordance
const btn = document.createElement('button')
btn.type = 'button'                          // also unnecessary outside a <form>
btn.className = styles.resetBtn
btn.textContent = 'Reset'
btn.addEventListener('click', handle)
parent.el.appendChild(btn)

// ✅ Idiomatic
const btn = Button('Reset')
btn.addClass(styles.resetBtn)
btn.on('click', handle)
parent.append(btn)
```

Same rule for inputs — there is no excuse to `document.createElement('input')` even for typed inputs:

```typescript
// ❌
const swatch = document.createElement('input')
swatch.type = 'color'
swatch.addEventListener('input', () => ...)

// ✅
const swatch = Input('', 'color', { value: '#ff8800' })
swatch.on('input', ({ value }) => ...)
```

### When raw JS is the right answer

Baseline doesn't wrap everything, and shouldn't. Use raw JS at the boundaries:

- DOM measurements (`getBoundingClientRect`, `offsetWidth`, `scrollTop`)
- Observers (`IntersectionObserver`, `ResizeObserver`, `MutationObserver`)
- One-off browser APIs (Clipboard, File, Notification, Geolocation, Web Workers, WebSocket)
- Reading from a Baseline component's underlying element (`c.el.focus()`, `c.el.scrollIntoView()`) — `.el` is the documented escape hatch

If you find yourself reaching past `.el` for something that *isn't* one of these, stop and look for the Baseline method first.

### File decomposition: prefer many small files

A component folder is the unit, not a single file. When a component grows, split along its natural seams instead of letting `index.ts` swell. Sibling files share the same `.module.css` (CSS Modules scope by file, but a `styles` import resolves to the same map across the folder).

**Common seams**

- **Container vs. row.** A `list` component owns the panel/header/empty-state; a sibling `item.ts` (or `row.ts`, `field.ts`) owns the per-row rendering. The list iterates and calls the item factory.
- **Rendering vs. pure data shaping.** Walking a tree, inferring kinds, normalizing values — these are pure functions that don't touch the DOM. Move them out so the component file is just composition.
- **Kind-specific render branches.** When a single render function carries an `if (kind === 'color') … else if (kind === 'size') …` ladder that's growing, lift each branch into its own factory.

**Heuristics**

- ~200 lines is the soft ceiling for one file. Past it, look for a seam.
- If you can describe two parts of the file with different one-line summaries, they belong in different files.
- A doc comment at the top of the file should describe *that file*, not a tour of three concerns. If the comment has three sections, the code probably wants three files.

**Example layout**

```
components/token-list/
├── index.ts            # TokenList panel: header, expand/collapse, dirty badge, form scaffold
├── field.ts            # renderField + kind inference + value coercion (the "row")
├── index.module.css    # shared styles for both
```

`index.ts` imports from `./field`; both import `styles` from `./index.module.css`. Keep doc comments local: each file's header describes only its own responsibility.

### Project-level wrappers

When the same component shape repeats (e.g. a "secondary button" with consistent styling), wrap the factory once and reuse it. This is the idiomatic alternative to copying class lists across call sites:

```typescript
// components/secondary-button/index.ts
import { Button } from '@codesuma/baseline'
import styles from './index.module.css'

export const SecondaryButton = (text: string) => {
    const base = Button(text)
    base.addClass(styles.base)
    return base
}
```

## Platform-idiomatic cheat sheet

The Baseline-first rule covers what Baseline provides. When code legitimately drops below Baseline to raw DOM / CSS / web APIs, the same spirit applies: use the platform's current, purpose-built solution — not the legacy pattern, and not a JS re-implementation of a native feature.

| Need | Legacy / roundabout (avoid) | Idiomatic (use) |
| ---- | --------------------------- | --------------- |
| Unified input (touch + mouse + pen) | paired `touchstart`/`mousedown` handlers | Pointer Events + `setPointerCapture` + CSS `touch-action` |
| An element's text color for borders / SVG / shadows | reading `getComputedStyle(...).color` in JS | `currentColor` / `inherit` |
| One value shared across many styles | duplicated literals, styles set from JS | CSS custom properties (`--x`) set once |
| Square / fixed-ratio boxes | padding-top percentage hack, JS resize math | `aspect-ratio` |
| Full-height layout on mobile | `100vh` + JS viewport corrections | `dvh` (keep a `vh` fallback line) |
| Spacing between siblings | margin arithmetic + `:last-child` resets | flex/grid `gap` |
| Reacting to visibility or size changes | scroll/resize listeners + `getBoundingClientRect` math | `IntersectionObserver` / `ResizeObserver` |
| Keyboard-only focus styles | JS input-modality tracking | `:focus-visible` |

Rule of thumb: if JavaScript is measuring or computing a value only to hand it straight back to a style or layout, the platform almost certainly has a declarative feature for it.

## Key Patterns

### Component Creation

```typescript
import { Div } from '@codesuma/baseline'
import styles from './index.module.css'

export const MyComponent = (data: SomeType) => {
    // Base
    const base = Div()
    base.addClass(styles.base)

    // ... build children, wire events ...
    // Child element
    const title = Div('Hello')
    title.addClass(styles.title)
    base.append(title)

    return Object.assign(base, { customMethod })
}
```

> Every component's root element is named `base` and uses the `.base` CSS class.
> Since CSS Modules scope class names per file, `.base` won't collide across components.

### Event Communication (child → parent)

```typescript
// Child emits
const myChild = ChildComponent()
// ... inside ChildComponent:
base.emit('save', data)

// Parent listens
myChild.on('save', (data) => persist(data))
```

### DOM Events via .on()

Baseline's `.on()` automatically proxies native DOM events. No need for `el.addEventListener`:

```typescript
btn.on('click', (e: MouseEvent) => { ... })
input.on('keydown', (e: KeyboardEvent) => { ... })
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Watch + serve on localhost:3000 |
| `npm run build` | One-time production build |
| `npm run watch` | Build with file watching |
| `npm run serve` | Serve the `build/` directory |

## Adding a New Component

1. Create a folder `src/components/{name}/` with `index.ts` and `index.module.css`
2. Use a factory function that returns a Baseline component (`const base = Div(); ...`)
3. Use `.emit()` for events the parent should handle
4. Export the component from `src/components/index.ts` (barrel file)
5. Import and compose in the parent component via the barrel: `import { MyComponent } from '../../components'`
