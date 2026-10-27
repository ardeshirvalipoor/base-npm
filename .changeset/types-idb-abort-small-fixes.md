---
"@codesuma/baseline": patch
---

- `index.ts` re-exports its types with `export type`. Compilers that work one file at a time, such as Vite, esbuild and swc, could not tell `IBaseComponent`, `IRouteEvent` and the other interfaces were types, so loading the package could fail there.
- `idb`: a transaction that aborts without an error event, for example when storage is full at commit, now rejects its promise. Before, `save()`, `get()`, `find()` and the rest never settled in that case. Also removes a branch of the connection cache that no caller reached.
- `state.clear()` now tells each key's subscribers that their value is gone, the way `state.remove()` does, before the `change` event with key `'*'`.
- `initRipple()` called a second time no longer adds a second set of listeners, which showed two ripples per press.
- `formatNumber()` no longer puts thousands separators in the decimals: `formatNumber(1234.5678, 4)` gives `1,234.5678`, not `1,234.5,678`.
