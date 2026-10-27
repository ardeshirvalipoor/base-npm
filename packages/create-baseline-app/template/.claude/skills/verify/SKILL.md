---
name: verify
description: How to check that a {{PROJECT_NAME}} change actually works — the build that acts as the typecheck, the tests, and looking at the app. Use after editing anything in src/, or when asked to confirm a change works.
---

# Verifying a {{PROJECT_NAME}} change

There is no linter. Verification is a clean build, passing tests, and looking at the app.

## 1. Build (this is the typecheck) and test

```bash
npm run build
```

The build is Rollup + TypeScript. `tsconfig.json` sets `noEmitOnError`, so a type error fails
it. It must finish with no errors. Nothing else typechecks this project.

There are no tests yet. When the project gets some, add their command here, and run it after
the build every time.

## 2. Look at it

```bash
npm run serve        # serves build/ on :3000 — run in the background
```

Stop it with `npm run web:stop`, not by killing node processes. If port 3000 is taken, check
what owns it before killing anything, and serve on another port instead:
`npx http-server build/ -p 3001 -c-1 --proxy "http://localhost:3001?"`.

Open each page the change touches, and open at least one route directly, such as `/about`,
to check the fallback for app routes still works. Report anything the browser console shows.
