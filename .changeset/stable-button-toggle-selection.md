---
"@darthcharles/greda": patch
---

Keep Button and buttonVariants geometry stable across variants by reserving a
transparent border for previously borderless variants. Auto-width buttons may
be approximately 2px wider; fixed-size buttons reserve the border inside their
existing bounds.

Buttons with aria-pressed, whether true or false, no longer animate selection
changes or move while pressed. Ordinary action-button feedback, popup-trigger
exclusions, and reduced-motion behavior are preserved. No prop migration is
required; use aria-pressed for toggle controls.
