---
"@codesuma/baseline": patch
---

- `idb`: a cached connection now closes itself on `versionchange`, so a store upgrade requested from another tab is no longer held up until this tab's idle timer closes the connection. The next call reopens at the new version.
- `http.get`: concurrent requests are deduplicated by URL together with `auth` and `headers`, not by URL alone, so two GETs with different tokens no longer share one response.
- Components waiting to enter the document are held weakly, so one that is built and never appended anywhere is no longer checked on every DOM mutation for the life of the page.
