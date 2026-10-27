---
"@codesuma/baseline": patch
---

`http` sends `Content-Type: application/json` only when the request has a body. It used to send it on every request, GET and DELETE included. On a request to another domain, that header makes the browser send a preflight request before the real one, so each cross-origin GET cost two round trips. A `Content-Type` passed in `headers` still wins.
