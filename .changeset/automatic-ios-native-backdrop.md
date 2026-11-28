---
"@darthcharles/greda": patch
---

Use native backdrops by default for supported modal Dialog and Drawer instances launched in standalone mode on iOS and iPadOS. Regular browser tabs still default to the fixed backdrop. Set `nativeBackdrop` to `true` or `false` to override the default. Nested Greda overlays portal into the native dialog so they can render above the panel.
