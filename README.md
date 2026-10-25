# @darthcharles/greda

A reusable React/TypeScript package built from **shadcn/ui component source**,
with a complete neutral base theme and consumer-owned token overrides.
Storybook documents each component in its own `*.stories.tsx` file.

## Quick start

```tsx
import { Button, Input, Label } from "@darthcharles/greda";
import "@darthcharles/greda/styles.css";
import "./theme.css";

export function Example() {
  return (
    <>
      <Label htmlFor="name">Name</Label>
      <Input id="name" />
      <Button>Continue</Button>
    </>
  );
}
```

React 18 and 19 are peer dependencies and are excluded from the ESM build.
Import the stylesheet once at the application entry point. CSS is compiled by
the package: consumers need **no Tailwind setup**. Utility classes use the `ds-`
prefix, and the baseline reset and Tailwind variable initialization are scoped to `.comal-ui`. Page layout, page
backgrounds, and fonts remain the application's responsibility.

```css
body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
}
```

## Consumer themes

Override any subset of tokens. Unspecified tokens retain their base values.
Colors use **space-separated HSL channels**, not hex or complete `hsl()` calls.
The overlay token additionally includes alpha. Other tokens accept CSS values.
Token names and value formats are part of the versioned public API.

```css
/* The consumer's theme.css */
:root {
  --primary: 9.500 55.556% 42.353%;
  --primary-hover: 9.714 56.150% 36.667%;
  --primary-foreground: 0 0% 100%;
  --ring: 9.500 55.556% 42.353%;
  --radius: 0.75rem;
}
```

Base token selectors use `:where()` so ordinary consumer selectors win even
if the library CSS loads later. Keep background/foreground pairs readable and
verify contrast in your theme. The base theme downloads no external fonts.
Comal's brand overrides belong in its consuming application.

Set `data-color-scheme="dark"` on `<html>` to opt into the base dark palette.
Brand identity and color scheme are independent. A consumer can customize dark
mode using `:root[data-color-scheme="dark"]` overrides.

Apply themes on `<html>` so portaled dialogs, selects, and tooltips inherit them.
For themes scoped to a subtree, pass the themed element to the content component's
`container` prop. `@darthcharles/greda/tokens.css` exports just the tokens;
`styles.css` already includes them.

### Base token reference

| Token | Default |
| --- | --- |
| `--background` | `0 0% 100%` |
| `--foreground` | `222 47% 11%` |
| `--card` | `0 0% 100%` |
| `--card-foreground` | `222 47% 11%` |
| `--popover` | `0 0% 100%` |
| `--popover-foreground` | `222 47% 11%` |
| `--accent` | `220 20% 94%` |
| `--accent-foreground` | `222 35% 20%` |
| `--primary` | `220 80% 45%` |
| `--primary-foreground` | `0 0% 100%` |
| `--primary-hover` | `220 80% 38%` |
| `--secondary` | `220 20% 94%` |
| `--secondary-foreground` | `222 35% 20%` |
| `--muted` | `220 15% 96%` |
| `--muted-foreground` | `220 10% 42%` |
| `--border` | `220 15% 82%` |
| `--input` | `220 15% 82%` |
| `--ring` | `220 80% 45%` |
| `--destructive` | `0 72% 43%` |
| `--destructive-foreground` | `0 0% 100%` |
| `--overlay` | `222 47% 11% / 0.4` |
| `--font-sans` | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| `--font-heading` | `var(--font-sans)` |
| `--font-size-xs` | `0.75rem` |
| `--font-size-sm` | `0.8125rem` |
| `--font-size-md` | `0.875rem` |
| `--font-size-lg` | `1.25rem` |
| `--font-weight-medium` | `500` |
| `--font-weight-bold` | `600` |
| `--line-height` | `1.5` |
| `--spacing-unit` | `0.25rem` |
| `--space-0` | `calc(var(--spacing-unit) * 0)` |
| `--space-0-5` | `calc(var(--spacing-unit) * 0.5)` |
| `--space-1` | `calc(var(--spacing-unit) * 1)` |
| `--space-1-5` | `calc(var(--spacing-unit) * 1.5)` |
| `--space-2` | `calc(var(--spacing-unit) * 2)` |
| `--space-2-5` | `calc(var(--spacing-unit) * 2.5)` |
| `--space-3` | `calc(var(--spacing-unit) * 3)` |
| `--space-3-5` | `calc(var(--spacing-unit) * 3.5)` |
| `--space-4` | `calc(var(--spacing-unit) * 4)` |
| `--space-5` | `calc(var(--spacing-unit) * 5)` |
| `--space-6` | `calc(var(--spacing-unit) * 6)` |
| `--space-8` | `calc(var(--spacing-unit) * 8)` |
| `--space-9` | `calc(var(--spacing-unit) * 9)` |
| `--space-10` | `calc(var(--spacing-unit) * 10)` |
| `--space-12` | `calc(var(--spacing-unit) * 12)` |
| `--space-16` | `calc(var(--spacing-unit) * 16)` |
| `--space-20` | `calc(var(--spacing-unit) * 20)` |
| `--space-24` | `calc(var(--spacing-unit) * 24)` |
| `--space-32` | `calc(var(--spacing-unit) * 32)` |
| `--radius` | `0.5rem` |
| `--radius-sm` | `calc(var(--radius) * 0.6)` |
| `--radius-full` | `9999px` |
| `--radius-lg` | `calc(var(--radius) * 1.5)` |
| `--border-width` | `1px` |
| `--dialog-width` | `32.5rem` |
| `--tooltip-width` | `20rem` |
| `--toast-width` | `24rem` |
| `--shadow-sm` | `0 1px 2px hsl(222 47% 11% / 0.08)` |
| `--shadow` | `0 8px 24px hsl(222 47% 11% / 0.12)` |
| `--shadow-dialog` | `0 24px 70px hsl(222 47% 11% / 0.24)` |
| `--focus-width` | `2px` |
| `--focus-offset` | `2px` |
| `--disabled-opacity` | `0.5` |
| `--duration` | `150ms` |
| `--z-overlay` | `50` |
| `--z-popover` | `60` |
| `--z-toast` | `70` |

The **Design Tokens** section in Storybook shows every token's value and a live
preview: color swatches, typography samples, spacing bars, corner shapes, shadows,
focus outlines, motion, opacity, sizing, and stacking layers. Its examples update
with the theme and color-scheme toolbar. The catalog reads directly from the token
stylesheet. Run `npm run docs:tokens` after editing tokens to refresh the reference
table in this README.

`--spacing-unit` scales the spacing utilities used by components. Named steps such
as `--space-1` (4px), `--space-2` (8px), `--space-4` (16px), and `--space-8` (32px)
derive from that unit. Override a single step to adjust every component utility
that uses it. Fractional steps use a hyphen, for example `--space-0-5` (2px).

```css
:root {
  --space-4: 1.25rem; /* Change the step used by px-4 and p-4. */
}
```

Radii, fonts,
shadows, focus, and semantic colors are also mapped through Tailwind to runtime
variables. Breakpoints are build-time application layout choices rather than
CSS variable tokens. Components fit their containers; dialog and toast content
are constrained to the viewport. Use composition and `className` for layout
changes and application-specific styling.

## Components and Storybook

| Component | Storybook source                                                     |
| --------- | -------------------------------------------------------------------- |
| Button    | [src/stories/Button.stories.tsx](src/stories/Button.stories.tsx)     |
| Input     | [src/stories/Input.stories.tsx](src/stories/Input.stories.tsx)       |
| Textarea  | [src/stories/Textarea.stories.tsx](src/stories/Textarea.stories.tsx) |
| Label     | [src/stories/Label.stories.tsx](src/stories/Label.stories.tsx)       |
| Select    | [src/stories/Select.stories.tsx](src/stories/Select.stories.tsx)     |
| Dialog    | [src/stories/Dialog.stories.tsx](src/stories/Dialog.stories.tsx)     |
| Card      | [src/stories/Card.stories.tsx](src/stories/Card.stories.tsx)         |
| Badge     | [src/stories/Badge.stories.tsx](src/stories/Badge.stories.tsx)       |
| Checkbox  | [src/stories/Checkbox.stories.tsx](src/stories/Checkbox.stories.tsx) |
| Tabs      | [src/stories/Tabs.stories.tsx](src/stories/Tabs.stories.tsx)         |
| Toast     | [src/stories/Toast.stories.tsx](src/stories/Toast.stories.tsx)       |
| Tooltip   | [src/stories/Tooltip.stories.tsx](src/stories/Tooltip.stories.tsx)   |

Each file contains default usage and relevant variants, sizes, disabled/loading,
validation, and keyboard documentation. The toolbar previews base/Comal themes
and light/dark color schemes. Noninteractive components do not invent loading
or disabled behavior. `npm run validate:stories` enforces one story file per
component. Storybook includes automatic prop documentation and an axe panel.

The public API follows shadcn's composition model:

- Button: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link` variants;
  `default`, `sm`, `lg`, `icon` sizes. `loading` sets `aria-busy` and disables native
  buttons. Set a useful label such as `Saving…`. The default type is `button`;
  pass `type="submit"` for forms. `asChild` supports links; disabled/loading
  behavior is intended for native buttons.
- Input, Textarea, Label: native field props and refs. Associate visible labels
  and connect errors using `aria-invalid` and `aria-describedby`.
- Select: SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel,
  SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton.
  Controlled values use `onValueChange`.
- Dialog: DialogTrigger, DialogContent, DialogTitle, DialogDescription,
  DialogHeader, DialogFooter, DialogClose, DialogOverlay, DialogPortal. Content
  includes a built-in accessible close button. Include a title. Explicitly pass
  `aria-describedby={undefined}` when there is no description.
- Card: CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
- Badge: `default`, `secondary`, `outline`, `destructive` variants.
- Checkbox: boolean or `indeterminate` state; controlled `onCheckedChange`.
- Tabs: TabsList, TabsTrigger, TabsContent; horizontal/vertical orientation.
- Toast: ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastAction,
  ToastClose. Supply one provider/viewport and control each toast's open state.
- Tooltip: TooltipProvider, TooltipTrigger, TooltipContent.

Radix remains a dependency of the shadcn components and supplies their keyboard
and ARIA behavior. Give icon buttons accessible names and keep critical errors
inline. `cn` is exported from the root and `@darthcharles/greda/utils`; it combines
conditional classes and merges conflicting `ds-` Tailwind utilities.

## Development

Use Node 24 (`nvm use`) and npm:

```bash
npm ci
npm run storybook         # http://localhost:6006
npm run check             # types, interactions, stories, package, static catalog
npm run test:browser      # render all stories, axe, theme/portal checks
npm pack                  # build a local package archive
```

Local browser tests use installed Google Chrome. CI installs Playwright Chromium.
Build Storybook before running browser tests (`npm run build-storybook`).
Build outputs are ignored: ESM and declarations go to `dist/`, compiled CSS to
`dist/styles.css`, and the static catalog to `storybook-static/`.

The Comal example in `.storybook/themes/comal.css` uses Meal Planner’s cream,
paper, terracotta, and sage palette with locally hosted DM Sans and Fraunces.
Its dark palette is a complementary Storybook example; Meal Planner currently
defines only light colors. Action and muted text colors use darker shades for
contrast. This example and its fonts are excluded from the published package. No application integration or registry publication is performed.

### shadcn source and updates

This package owns customized copies of the React 18-compatible New York component
sources and builds them with Tailwind 3.4. `components.json` records aliases, CSS,
style, and prefix settings. Original registry responses, hashes, and MIT license
are preserved in `upstream/shadcn-ui/`; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

To update, review changes against those snapshots and preserve the documented
local adaptations. `node scripts/fetch-shadcn.mjs` refreshes only the upstream
snapshots and manifest; it does not overwrite local components. Upstream CLI
updates may overwrite customizations, so review their diffs before keeping them.

### Versioning and publishing

Use `npm run changeset` for a change description, then `npm run version-packages`
to prepare the version and changelog. Compatible features use minors and fixes
use patches. Breaking prop, token, or export changes need explicit notes and a
minor bump before 1.0, then a major bump after 1.0. CI validates the package and
Storybook. `npm run release` validates and publishes through Changesets using
the maintainer's npm credentials. Publishing requires an explicit release action.
