---
"@codesuma/baseline": patch
---

Fix a double tap on a link pushing two history entries for the same page, so it took two `back()` calls to leave it. The second `goto()` started while the first was still waiting for the old page's exit animation, before the router had moved to the new path, so it passed the "already there" check and pushed again. Navigations now run one at a time: a `goto()` that comes during another one starts once that one has finished, and is ignored if it goes to the page that one landed on. This also means two quick taps on different links each exit their page before the next one enters.

The back and forward buttons now pass their direction to the navigation directly, instead of through a shared flag that a later `goto()` could pick up.
