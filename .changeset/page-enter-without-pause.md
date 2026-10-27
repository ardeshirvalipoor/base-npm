---
"@codesuma/baseline": patch
---

`Page` starts its enter animation as soon as the old page has left, instead of 200 ms later. The wait dates from before the router awaited `exit` handlers: back then, the exit animation and the wait ran side by side. Since 1.2.0 the router waits for the exit to finish, so the two delays added up, and every navigation showed no page at all for 200 ms. A navigation now takes 320 ms instead of 520 ms.

The wait also let an invisible slide finish, when a page moved from one hidden side to the other before entering. The page now jumps there with its transitions off, so the enter animation still starts from the right side: from below going forward, from above going back.
