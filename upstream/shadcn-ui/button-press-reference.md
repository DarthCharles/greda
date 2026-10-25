# Button press interaction reference

The legacy New York registry snapshot in button.json has no active transform.
The current Nova style defines:

```css
active:not-aria-[haspopup]:translate-y-px
```

Source: https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/styles/style-nova.css

Our Tailwind 3 equivalent is `active:[&:not([aria-haspopup])]:ds-translate-y-px`.
A motion-reduce variant disables this movement for reduced-motion preferences.
