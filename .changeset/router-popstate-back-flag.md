---
"@codesuma/baseline": patch
---

Fix the router carrying `isBack` into the next navigation after a `popstate` that lands on the current path. The popstate handler set `isBackNavigation` before checking whether the path had changed, and only `navigate()` cleared it, so an entry the app had pushed itself for a query change on the same route (a two-panel layout opening a second item beside a list) left the flag set once the user went back. The next `goto()` was then treated as a back navigation: no `pushState`, the address stayed put, and a later `back()` skipped the page the user expected to return to. The flag is now set only when the popstate actually navigates.
