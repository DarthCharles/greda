---
"@darthcharles/greda": major
---

Migrate component spacing, dimensions, and offsets to the named scale. Some defaults change as values snap to the nearest named step. Update component overrides from numeric tokens to the named step the component uses. For example, override `--space-md` for Button’s horizontal padding and `--space-xl` for its default height.

Remove the 19 deprecated numeric `--space-*` custom properties and their Tailwind 4 aliases from the CSS exports. Replace references such as `var(--space-4)` with `var(--space-md)`. Numeric utilities such as `p-4` still use `--spacing-unit` when compiled with Greda’s Tailwind 4 token import. See the README for the token migration map.

`max-w-lg` now resolves to `--space-lg` in the precompiled and Tailwind 4 builds. Use `--dialog-width` to customize Dialog, or `max-w-[var(--dialog-width)]` when applying the same cap to other elements in a Tailwind build.
