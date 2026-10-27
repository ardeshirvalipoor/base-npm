---
"@codesuma/baseline": patch
---

Fix the children list going wrong when components move:

- Appending a child that is already in the parent, to move it to the end, no longer lists it twice in `getChildren()`. A list that re-appended its items to sort them grew on every sort.
- Moving a child to another parent takes it out of the old parent's list. Before, a later `empty()` on the old parent removed it from the new one.
- `prepend(a, b)` and `appendAfter(ref, a, b)` keep the order of their arguments. Both used to put `b` before `a`.
- `remove()` takes the component out of the document but leaves its own children in place, so it can be appended again as it was. Before, it emptied the component, and a removed card came back blank. Every component in the subtree still gets `unmounted`, and `mounted` again when it returns.
