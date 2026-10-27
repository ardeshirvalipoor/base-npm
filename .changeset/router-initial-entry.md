---
"@codesuma/baseline": patch
---

Fix the first `back()` doing nothing on the page the app opened on. The router's first navigation, to the page the browser loaded, pushed a history entry for it although the browser already had one, so the history held two entries for the same path. Going back landed on the first of them, which the popstate handler ignores because the path has not changed, and it took a second `back()` to leave the page. This showed after any reload or deep link: an app that reloads itself to change its language had to be told to go back twice to leave the page it reloaded on. The first navigation now leaves the history as the browser loaded it.
