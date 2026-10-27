---
"@codesuma/baseline": patch
---

- `Button` click handlers now receive the click event, like every other component's DOM events. `Button` used to set `onclick` only to call `emit('click')` with no payload, so a handler that called `e.preventDefault()` threw. `btn.emit('click')` still calls the handlers.
- `.off()` now removes a handler that was registered for more than one DOM event, such as `on(['mouseenter', 'focus'], h)`. Before, the handler kept firing on one of them. `.on()` now hands the handler itself to `addEventListener`, so the map of wrapped handlers is gone.
