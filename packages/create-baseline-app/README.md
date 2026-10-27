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

Without a name, it asks for one. Then:

```bash
cd my-app
npm run dev
```

## What You Get

```
my-app/
├── .claude/skills/verify/  # How an AI agent checks a change
├── build/
│   └── index.html          # Pre-configured HTML shell
├── scripts/
│   └── kill-port.mjs       # Frees the dev server's port (npm run web:stop)
├── src/
│   ├── components/         # Your reusable components
│   ├── pages/
│   │   ├── home/           # Starter home page with counter
│   │   └── about/          # Starter about page
│   ├── services/           # API calls, state management
│   ├── app.ts              # App setup with router
│   ├── index.ts            # Entry point
│   └── css-modules.d.ts    # TypeScript support for CSS modules
├── AGENTS.md               # Rules for AI agents, imported by CLAUDE.md
├── AI_GUIDE.md             # How to write Baseline code
├── CLAUDE.md
├── package.json
├── rollup.config.js        # Rollup with TypeScript, CSS Modules, terser
├── tsconfig.json           # Strict; a type error fails the build
└── .gitignore
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Build (watch mode) + serve on localhost:3000 |
| `npm run build` | One-time production build |
| `npm run watch` | Build with file watching |
| `npm run serve` | Serve the `build/` directory. App routes such as `/about` open directly. |
| `npm run web:stop` | Free port 3000 when a server is left running |

## Learn More

- [Baseline Documentation](https://www.npmjs.com/package/@codesuma/baseline)
- [GitHub Repository](https://github.com/ardeshirvalipoor/base-npm)

## License

MIT
