# Create Baseline App

Scaffold a new [Baseline](https://www.npmjs.com/package/@codesuma/baseline) project in seconds.

## Usage

```bash
npx @codesuma/create-baseline-app my-app
```

Or with `npm create`:

```bash
npm create @codesuma/baseline-app my-app
```

Then follow the prompts:

```bash
cd my-app
npm run dev
```

## What You Get

```
my-app/
├── build/
│   └── index.html          # Pre-configured HTML shell
├── src/
│   ├── components/         # Your reusable components
│   ├── pages/
│   │   ├── home/           # Starter home page with counter
│   │   └── about/          # Starter about page
│   ├── services/           # API calls, state management
│   ├── app.ts              # App setup with router
│   ├── index.ts            # Entry point
│   └── css-modules.d.ts    # TypeScript support for CSS modules
├── package.json
├── rollup.config.js        # Rollup with TypeScript, CSS Modules, terser
├── tsconfig.json
└── .gitignore
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Build (watch mode) + serve on localhost:3000 |
| `npm run build` | One-time production build |
| `npm run watch` | Build with file watching |
| `npm run serve` | Serve the `build/` directory |

## Learn More

- [Baseline Documentation](https://www.npmjs.com/package/@codesuma/baseline)
- [GitHub Repository](https://github.com/ardeshirvalipoor/base-ui)

## License

MIT
