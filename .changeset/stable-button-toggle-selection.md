---
"@darthcharles/greda": patch
---

Fix Button and buttonVariants resizing when changing variants. Previously
borderless auto-width buttons may be approximately 2px wider; fixed-size buttons
retain their existing bounds.

Buttons with aria-pressed, whether true or false, no longer animate selection
changes or move while pressed. Ordinary action-button feedback, popup-trigger
exclusions, and reduced-motion behavior are preserved. No prop migration is
required; use aria-pressed for toggle controls.
