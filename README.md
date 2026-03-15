# Baseline

A minimal, imperative UI framework for building fast web apps. No virtual DOM, no magic, no dependencies.

**~1000 lines** of TypeScript that gives you everything you need for SPAs.

## Installation

```bash
npm install @codesuma/baseline
```

📖 **[Full Documentation →](packages/baseline/README.md)**

## Quick Start

```typescript
import { Div, Button, router } from '@codesuma/baseline'

const App = () => {
    const app = Div()
    const count = { value: 0 }
    
    const counter = Div('0')
    counter.style({ fontSize: '48px', textAlign: 'center' })
    
    const btn = Button('Click me')
    btn.on('click', () => {
        count.value++
        counter.text(String(count.value))
    })
    
    app.append(counter, btn)
    return app
}

document.body.appendChild(App().el)
```

## Repository Structure

```
├── packages/baseline/     ← The npm package (@codesuma/baseline)
├── examples/demo-app/     ← Example app (not published)
└── package.json           ← Root workspace config
```

## Development

**Important**: Because this uses npm workspaces, you **must** run `npm install` from the root directory first. Do not run it inside the examples folder.

```bash
npm install                 # Install dependencies for ALL workspaces (run this at the root!)
npm run build:example       # Build example app
npm run start:example       # Serve at localhost:9876
```

## Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
npm run changeset           # 1. Create a new changeset (describe your changes)
npm run version-packages    # 2. Bump versions and update CHANGELOG.md
npm run release             # 3. Publish to npm
```

---

MIT License
