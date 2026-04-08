# AI Agent Guide for Baseline

> Read this before making any changes to the library.

## Architecture Principles (MUST follow)

1. **Factory functions, not classes** — Never introduce class-based components
2. **Composition via `Object.assign`** — New capabilities are added via mixin factories (`createEmitter`, `createAppender`, `createStyler`)
3. **No runtime dependencies** — Never add npm dependencies to the library
4. **Direct DOM** — No virtual DOM, no diffing, no reactivity magic
5. **Explicit over implicit** — No hidden state, no proxy-based reactivity
6. **Emitter is dual-purpose** — `createEmitter()` works both standalone (global event bus) and mixed into components via `Object.assign`

## Constraints (MUST NOT violate)

- Do NOT add React/Vue/Svelte patterns (hooks, refs, signals, JSX)
- Do NOT use `class` or `extends` in library code
- Do NOT make components aware of the router or other lib modules
- Do NOT add browser polyfills — the library targets modern browsers
- Do NOT modify the public API without updating `index.ts` exports
- Do NOT import from `lib/` inside `utils/` or `components/` (one-way dependency)

## Dependency Direction

```
helpers/  →  (standalone, no imports from library)
utils/    →  imports from utils/ only
components/  →  imports from utils/ only
lib/      →  imports from utils/ and components/
index.ts  →  re-exports everything
```

## Naming Conventions

| Category | Convention | Examples |
|----------|-----------|----------|
| Component factories | PascalCase | `Div`, `Button`, `Input`, `Page` |
| Utility factories | camelCase | `createEmitter`, `createStyler`, `createRouter` |
| Lib singletons | camelCase default export | `router`, `http`, `state`, `ldb`, `idb` |
| Events | lowercase strings | `'click'`, `'mounted'`, `'enter'`, `'exit'` |
| CSS class methods | camelCase | `addClass`, `removeClass`, `toggleClass` |
| Style objects | camelCase CSS properties | `fontSize`, `backgroundColor` |
| Interfaces | `I` prefix + PascalCase | `IBaseComponent`, `IEmitter`, `IStyler` |

## File Organization

```
baseline/
├── components/
│   ├── base.ts           ← Core factory (Base, BaseSVG)
│   ├── native/           ← One file per HTML element wrapper
│   └── advanced/         ← Higher-order components (Page)
├── lib/                  ← Framework services
│   ├── router.ts         ← SPA router (factory + singleton)
│   ├── http.ts           ← Fetch wrapper with dedup
│   ├── state.ts          ← Global key-value state
│   ├── ldb.ts            ← localStorage wrapper
│   └── idb.ts            ← IndexedDB wrapper
├── utils/                ← Internal capability factories
│   ├── emitter.ts        ← Event emitter (dual-purpose)
│   ├── appender.ts       ← DOM tree management + mounting
│   ├── styler.ts         ← Inline styles, classes, attr, text
│   ├── id.ts             ← ID generators
│   ├── ripple.ts         ← Material ripple effect
│   └── wait.ts           ← Promise-based delay
├── helpers/              ← Pure utility functions
│   ├── date.ts, device.ts, format.ts, locales.ts, regex.ts
└── index.ts              ← Barrel export
```

## How to Add a New Native Component

1. Create `components/native/{name}.ts`
2. Import `Base` from `'../base'`
3. Call `Base('{tagname}')` and extend with `Object.assign`
4. Export the factory function with PascalCase name
5. Add the export to `index.ts`

Example:
```typescript
import { Base } from '../base'

export const Form = (action = '') => {
    const base = Base('form')
    if (action) base.attr('action', action)
    base.el.onsubmit = (e) => {
        e.preventDefault()
        base.emit('submit', new FormData(base.el))
    }
    return base
}
```

## How to Add a New Lib Module

1. Create `lib/{name}.ts`
2. Use `createEmitter()` if it needs event support
3. Export as default object with methods (and optionally a `create*` factory)
4. Add the export to `index.ts`

## DOM Event Proxy

`Base()` and `BaseSVG()` automatically proxy native DOM events through `.on()`/`.off()`. This is handled by the internal `proxyDomEvents()` helper in `base.ts`.

**How it works:**
- When `.on(event, handler)` is called, if `'on' + event` exists on the element (e.g. `onclick`, `onfocus`), the handler is also registered via `el.addEventListener`
- `.off(event, handler)` removes both the emitter listener and the DOM listener
- Custom/framework events (e.g. `'mounted'`, `'save'`) pass through the emitter only
- This means consumers never need to use `el.addEventListener` directly

**Key implementation details:**
- The proxy wraps each handler and stores the mapping in a `Map<Function, Function>` so `.off()` can find and remove the correct DOM listener
- If `el.onXxx` is already set (e.g. `el.onclick` in Button, `el.onchange` in Select), the proxy skips `addEventListener` for that event to avoid double-firing. The component's manual `el.onXxx → emit()` bridge takes priority, preserving custom payloads
- Native components that enrich event payloads (Input emits `{ value, event }` for `change`, Select emits the value string) MUST use `el.onXxx` to prevent the proxy from also registering a raw DOM listener

**Pattern — component communication via emitter:**
```typescript
// Child emits
const row = Div()
row.emit('save', data)
row.emit('finish', newBlocks)

// Parent listens
const child = BlockRow()
child.on('save', () => persist())
child.on('finish', (data) => rerender(data))
```

This is the idiomatic way for child→parent communication in Baseline. Prefer emitter events over callback options.

## Component Lifecycle

```
Base() → created
  ├── append(child) → child.parent set
  ├── on('mounted') → element entered document.body
  ├── on('unmounted') → element removed from DOM
  ├── remove() → detaches from DOM, reattachable
  └── destroy() → detaches + removes all listeners (permanent)
```

## Testing Changes

```bash
# From the repo root:
npm run build:example           # Build example app
npm run start:example           # Serve at localhost:9876

# Or from the example directory:
cd examples/demo-app
npm run compile
npm run start
```

Check for TypeScript errors:
```bash
cd examples/demo-app && npx tsc --noEmit
```
