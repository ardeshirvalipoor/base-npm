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
- Do NOT use `el.addEventListener` directly — use Baseline's `.on()` method which auto-proxies DOM events
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
