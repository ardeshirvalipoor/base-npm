---
"@codesuma/create-baseline-app": patch
---

Fix silently untranspiled TypeScript in scaffolded apps. Baseline ships raw `.ts`, and once its `node_modules` sources joined the TS program, the compiler's inferred common source directory shifted, so `@rollup/plugin-typescript`'s output lookup missed for early-loaded `src/` files — they passed through rollup untranspiled (a parse error on TS-only syntax like `window as any`, or silently unchecked code when it happened to parse as JS, which the starter code does). The template tsconfig now pins `"rootDir": "."` and includes `node_modules/@codesuma/baseline/**/*.ts` (with tests excluded) so emit paths stay stable from the first loaded module.
