---
"@codesuma/baseline": patch
---

Fix double-fired `change`/`input`/`keydown` on label-wrapped checkbox and radio inputs. The Input factory re-emitted the inner input's events with a `{ value, event }` payload, but `.on()` (proxyDomEvents) also attached a native listener on the label wrapper, which the same event bubbled to — so handlers ran twice, the second time with the raw DOM event, where a destructured `value` is `undefined` (silently reverting toggled state in handlers like `({ value }) => save(value)`). The forwarding handlers now sit on the wrapper element itself for bubbling events, which also blocks the duplicate native proxy (the `on<event>` property is set). Also `toggle()` now emits the same `{ value }` payload shape as a user-initiated change instead of a bare boolean.
