# Contributing to Baseline

Thanks for your interest in contributing to Baseline! This guide will help you get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/ardeshirvalipoor/base-npm.git
cd base-npm

# Install all workspace dependencies
npm install

# Build the example app (watches for changes)
npm run build:example

# Serve locally
npm run start:example
# Visit http://localhost:9876
```

## Project Structure

The library lives in `packages/baseline/`. The example app is in `examples/demo-app/`.

```
base-npm/
├── packages/
│   └── baseline/         ← THE LIBRARY (published to npm)
│       ├── components/
│       ├── lib/
│       ├── utils/
│       ├── helpers/
│       └── index.ts
├── examples/
│   └── demo-app/         ← Example consumer app
│       ├── components/
│       ├── pages/
│       └── app.ts
├── package.json          ← Root workspace config
└── build/                ← Example app output
```

## Code Style

- **No classes** — Use factory functions + `Object.assign` composition
- **No dependencies** — The library must remain zero-dependency
- **TypeScript** — All library code must be in TypeScript
- **Chainable API** — Methods should return `this` or the component for chaining
- **PascalCase** for component factories (`Div`, `Button`)
- **camelCase** for utility functions and methods

## Pull Request Guidelines

1. **Keep PRs small and focused** — One feature or fix per PR
2. **Update `index.ts`** if you add/remove/rename any exports
3. **Update `AI_GUIDE.md`** if you change architectural patterns
4. **Test with the example app** — Make sure `npm run compile` succeeds

## Architecture Rules

Before contributing, please read `AI_GUIDE.md` for the full list of architectural constraints.

The key rules:
- Components are created via factory functions, never classes
- Capabilities (events, DOM tree, styling) are mixed in via `Object.assign`
- The emitter works both standalone and as a component mixin
- `utils/` must not import from `lib/` or `components/`
- `helpers/` must not import from anywhere in the library

## Publishing

Releases go through changesets, from the repo root:

```bash
npm run changeset        # describe the change and pick patch / minor / major
npm run release          # bumps versions and changelogs, then publishes
```

`npm run version-packages` does the bump on its own and `npm run publish:baseline`
publishes on its own, for when the two steps should be separate. Commit the
changeset together with the change it describes.

Only the files listed in `package.json` → `files` are published.
- `components/**/*`
- `helpers/**/*`
- `lib/**/*`
- `utils/**/*`
- `index.ts`
- `README.md`
