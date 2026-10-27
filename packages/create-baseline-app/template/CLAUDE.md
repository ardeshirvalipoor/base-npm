# CLAUDE.md

{{PROJECT_NAME}} is a web app built on `@codesuma/baseline`.

First setup: `npm install`. Then `npm run dev` builds, watches and serves the app on
<http://localhost:3000>. If a server is left running on that port, `npm run web:stop` frees it.

- **`npm run build` is the typecheck.** `tsconfig.json` sets `noEmitOnError`, so a type error
  fails the build. The `verify` skill says how to check a change.
- **The dev server's `--proxy "http://localhost:3000?"` is the fallback for app routes.** Keep
  it. A path with no file behind it comes back to the server as a query string and is served
  `index.html`, so `/about` opens directly instead of returning 404.

## Frontend pattern

No framework. The UI is `@codesuma/baseline`: factory functions, `Div()` composition, CSS
modules, emitter events, no runtime dependencies beyond baseline. Its rules are in AGENTS.md,
imported here:

@AGENTS.md
