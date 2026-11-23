# Greda

Composable React components with a neutral base theme and CSS tokens you control.
Built from shadcn/ui New York and Radix primitives, with compiled styles and
TypeScript declarations. Supports React 18 and 19; no Tailwind setup required.

**[Explore Storybook](https://elegant-hotteok-cbb834.netlify.app/)** ·
[Getting started](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/introduction-overview--getting-started) ·
[Design tokens](https://elegant-hotteok-cbb834.netlify.app/?path=/story/design-tokens--overview)

## Quick start

Install into an existing React application with React and React DOM 18.2+ or 19:

```bash
npm install @darthcharles/greda
```

Import the stylesheet once at your application's entry point:

```tsx
import "@darthcharles/greda/styles.css";
```

Then import the components you need:

```tsx
import { Button } from "@darthcharles/greda";

export function Example() {
  return <Button>Continue</Button>;
}
```

The stylesheet includes a ready-to-use base theme, CSS tokens, and scoped
component styles. No custom theme or additional CSS is required to use Greda.
Your application controls its own page layout, backgrounds, and fonts. React
and React DOM remain peer dependencies outside the ESM bundle.

Visit [Storybook](https://elegant-hotteok-cbb834.netlify.app/) for component APIs,
variants, interaction examples, and accessibility guidance.

Greda and application markup share unprefixed utility classes such as
`surface-primary`, `text-primary`, and `border-primary`. Pass them through
`className` to override component defaults. See the introduction guide for supported
utilities and migration from `ds-*` classes.

## Icons

Import Lucide icons and types through Greda's dedicated entry point. No separate
`lucide-react` installation is required:

```tsx
import { Button } from "@darthcharles/greda";
import { Plus, type LucideProps } from "@darthcharles/greda/icons";

const iconProps = { strokeWidth: 1.5 } satisfies LucideProps;

export function AddButton() {
  return (
    <Button size="icon" aria-label="Add item">
      <Plus {...iconProps} aria-hidden="true" />
    </Button>
  );
}
```

This entry point re-exports the installed Lucide API, including `LucideIcon` and
`LucideProps`, with the original SVG props and refs. Use named icon imports so
your bundler can remove unused icons. Icons inherit the current text color;
standalone icons accept `size`, `color`, and `strokeWidth`. Greda buttons size
their SVG icons automatically. Standalone icons do not require Greda's CSS.
Give icon-only controls an accessible name and hide decorative icons with
`aria-hidden="true"`.

See the [Iconography guide](src/stories/Iconography.mdx) for common icons, sizing,
stroke weight, color inheritance, and accessible composition examples.

## Buttons

`Button` defaults to `type="button"`, `variant="default"`, and `size="default"`.
Set `type="submit"` explicitly for form submission. Use the default variant for
the main action, secondary or outline for alternatives, and ghost for actions
that need less emphasis. Destructive identifies actions with destructive
consequences. The link variant changes styling; use `asChild` with an anchor for
navigation.

`loading` sets `aria-busy` and disables native buttons. Supply a useful label,
such as “Saving…”. With `asChild`, the child retains its semantics; disabled and
loading do not prevent an anchor from navigating.

See the [Button reference](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/components-button--docs)
for variant guidance, defaults, sizes, keyboard interaction, and a form example.

## Toggle buttons

For toggle buttons, set `aria-pressed` to the current selection state and
update that state in `onClick`. Users can activate the button with a click,
Enter, or Space. This also applies to native buttons styled with `buttonVariants`.

## Radio groups

Use `RadioGroup` and `RadioGroupItem` to choose one option from a visible set.
Label the group and each item. Use `defaultValue` for an initial selection or
`value` and `onValueChange` for controlled state; `name` and `required` support forms.

See the [Radio Group reference](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/components-radio-group--docs)
for composition, keyboard interaction, horizontal layout, and validation examples.

## Collapsible content

Use `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent` for optional
content that expands in place. Use `defaultOpen` for an initially expanded panel
or `open` and `onOpenChange` for controlled state. Compose the trigger with
`Button` through `asChild` for button variants and sizes.

See the [Collapsible reference](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/components-collapsible--docs)
for keyboard interaction, composition, and disabled states.

## Form fields

`Input`, `Textarea`, `SelectTrigger`, `ComboboxInput`, `Checkbox`, and
`RadioGroupItem` use `surface-raised` backgrounds across all themes. Checked and
indeterminate checkboxes retain their primary fill. Override their `className` for a different
surface. Existing border, validation, and focus styles are preserved.

## Searchable selection

Use `Combobox` for filtering as you type and optional option creation. It uses
existing Radix dependencies. `Select` remains available for simple selection.

Import the same package stylesheet shown in Quick start, then compose the field:

```tsx
import {
  Combobox, ComboboxInput, ComboboxContent, Label,
} from "@darthcharles/greda";

const materials = [
  { value: "clay", label: "Clay", keywords: ["pottery"] },
  { value: "linen", label: "Linen" },
];

export function MaterialField() {
  return (
    <>
      <Label htmlFor="material">Material</Label>
      <Combobox
        options={materials}
        name="material"
        onCreate={(label) => ({ value: crypto.randomUUID(), label })}
      >
        <ComboboxInput id="material" placeholder="Choose or create" required />
        <ComboboxContent />
      </Combobox>
    </>
  );
}
```

See the [usage guide](src/stories/Combobox.mdx) for controlled state, remote
search, creation callbacks, forms, and keyboard interaction. Explore the
[Storybook examples](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/components-combobox--docs)
for component states.

## With Tailwind 4

Import Greda's tokens in your app's Tailwind CSS entry point. This registers the
theme so Tailwind can generate utilities without a preset or manual mappings:

```css
@import "tailwindcss";
@import "@darthcharles/greda/tokens.css";
```

```tsx
<div className="bg-primary p-md text-primary-foreground hover:bg-primary-hover">
  Your content
</div>
```

To use Greda components too, add
`@import "@darthcharles/greda/styles.css" layer(components);` between those two
imports, instead of importing `styles.css` again in JavaScript. The layer lets
your generated utilities override component styles, including responsive variants.
The import-only theme integration requires Tailwind 4; Greda's precompiled
component styles also work without Tailwind.

## Typography

Shared typography roles work with compiled CSS and Tailwind 4:

```tsx
<h1 className="text-display text-primary">Take your time.</h1>
<p className="text-body text-secondary">A little room to explore.</p>
<p className="text-caption text-muted">Materials included</p>
```

Use `text-display`, `text-title`, `text-body`, `text-label`, `text-caption` and
`text-eyebrow` for complete styles: family, size, weight, line height and tracking.
Colors, margins, casing, italics and HTML semantics remain independent. Existing
size utilities such as `text-sm` still work; `font-medium` can adjust one part of
a role. Tailwind 4 can generate variants such as `md:text-title`.

Customize a role on the same theme boundary using `--type-ROLE-family`, `-size`,
`-weight`, `-leading` and `-tracking`, for example
`--type-display-size: clamp(2rem, 6vw, 4rem)`. Font aliases rebind at theme
boundaries so scoped font overrides apply. See **Design Tokens → Typography**
in Storybook to choose a style, customize its tokens, and browse the foundation
reference. Each style has a live preview and expandable token details.

## Theming

The **Theming** section in Storybook documents the optional brand themes.
For an optional ready-made identity, import Cobalto after the package stylesheet
and select it on the document root:

```tsx
import "@darthcharles/greda/styles.css";
import "@darthcharles/greda/themes/cobalto.css";
// <html data-theme="cobalto" data-color-scheme="light">
```

Cobalto supplies blue/paper colors, Arial/Helvetica and square corners, with a
complementary dark palette selected by `data-color-scheme="dark"` on the same
element. Importing it alone leaves the neutral base unchanged. The application
still controls page backgrounds and fonts. Select **cobalto** in Storybook to
preview components, and see the [composition recipe](src/stories/Cobalto.mdx)
for large mixed-weight titles, an asterisk, a polaroid photo, scoped portals,
and Tailwind 4 import order. The recipes use Tailwind utilities directly in JSX;
compile them with your application’s Tailwind 4 setup.

Comal is also available as an optional theme. Import
`@darthcharles/greda/themes/comal.css` after the package stylesheet and set
`data-theme="comal"` with `data-color-scheme="light"` or `"dark"` on the same
element. Inspired by Mexican cazuelas de barro, it uses warm ivory backgrounds,
near-white raised surfaces, tan stone supporting surfaces and borders, warm
charcoal text, terracotta actions, pale sage tertiary panels, and warm tan secondary controls,
with clay-tinted interaction fills and rounded corners. Dark mode pairs warm charcoal
surfaces with copper actions. Its standard text roles and field borders support the primary, secondary,
raised, tertiary, accent, and secondary-control surfaces in both color schemes.
Badge backgrounds stay stable on hover; buttons retain their hover feedback.
Its font stacks reference DM Sans and Fraunces; load those fonts in your application or
override `--font-sans` and `--font-heading`. No fonts are downloaded or bundled
by these themes. Theme exports can be imported together and selected by attribute.
See the [Comal composition recipe](src/stories/Comal.mdx) for a complete fictional
workshop page, optional font setup, responsive layout and copyable Tailwind JSX.

Matrix adds a terminal identity with green actions, system monospace fonts and
square controls. Import `@darthcharles/greda/themes/matrix.css` after the package
stylesheet and set `data-theme="matrix"` with `data-color-scheme="dark"` for
green-black surfaces, or `"light"` for pale green surfaces. No font setup is
required. Select **matrix** in Storybook to preview components, or see the
[Matrix composition recipe](src/stories/Matrix.mdx) for a responsive console
layout and Tailwind 4 setup.

La Viuda combines cream surfaces, chile-red actions, soft green supporting
surfaces, Geist typography, and modest corners. Import
`@darthcharles/greda/themes/la-viuda.css` after the package stylesheet and set
`data-theme="la-viuda"` with `data-color-scheme="light"` or `"dark"` on the same
boundary. Load Geist in your application or supply `--font-geist-sans`; the theme
also supports custom font overrides and falls back to Arial/Helvetica. Select
**la-viuda** in Storybook to explore the theme and its Tokens palette, or see the
[La Viuda composition recipe](src/stories/LaViuda.mdx) for a static ranch shop
with produce and ranch goods, product photography, a sample basket, font setup,
and Tailwind 4 integration.

Customization is optional. To change the default theme, import your own
`theme.css` after the package stylesheet and override the base colors or other
tokens you need.
Unspecified values keep their base defaults, and components and color utilities
automatically use your overrides:

```css
/* theme.css */
:root {
  --base-primary: 9.500 55.556% 42.353%;
  --base-primary-hover: 9.714 56.150% 36.667%;
  --radius: 0.75rem;
}
```

Colors use space-separated HSL channels without an `hsl()` wrapper;
`--overlay` also includes alpha. Other tokens accept ordinary CSS values.

Consumers override only the generic base colors: `--base-primary`,
`--base-primary-hover`, `--base-secondary`, `--base-tertiary`, `--base-accent`,
`--base-destructive`, `--base-white`, `--base-black`, and selected
`--base-gray-*` steps (50, 100, 200, 300, 500, 600, 800, 900). Every theme uses
the same names. Greda assigns them to independent roles and utilities:

| Category | Utility examples | Default light base colors |
| --- | --- | --- |
| Surfaces | `surface-primary`, `surface-secondary`, `surface-tertiary`, `surface-inverse` | White, gray-100, tertiary, black |
| Text | `text-primary`, `text-secondary`, `text-muted`, `text-inverse` | Black, gray-600, gray-500, white |
| Borders | `border-primary`, `border-secondary`, `border-inverse` | Gray-200, gray-100, gray-600 |

`bg-primary` / `bg-secondary` use base primary/secondary action colors.
Base uses distinct secondary and hover/focus accent shades in both color schemes;
override `--base-secondary` and `--base-accent` independently to customize them.
Primary text and borders use their neutral base assignments independently.
Dark assignments are built in. Define base overrides on `:root` or a
`data-theme` element; scoped themes automatically rebind the role variables.
Consumers do not need to declare surface, text, or border tokens.
`surface-tertiary` uses `--base-tertiary`: soft blue (`#eff6ff`) in Base and
pale sage (`#ced8c4`) in Comal, with darker counterparts in dark mode.
Override `--base-tertiary` to customize this surface independently of accent
backgrounds and hover states.

`styles.css` includes role utilities and hover/focus variants; the Tailwind 4
import also generates responsive and opacity variants. Start with Storybook's
**Design Tokens → Overview**. **Base colors** shows the palette you customize,
with brand/state colors first and neutrals second. **Color roles** combines
surface, text, and border assignments with live examples. Other foundations
have separate pages.

**Migration:** move color overrides to the generic base slots above. In particular,
`--primary` becomes `--base-primary`. `text-primary`, `text-secondary`,
`text-muted`, `border-primary`, and `border-secondary` use category roles
rather than the matching action color. Use `text-action` / `border-action`
for action colors. Existing component tokens remain as derived variables;
Greda owns their assignments. Tooltip uses inverse surface/text roles.

Set `data-color-scheme="dark"` on `<html>` for the base dark palette. Brand
overrides need matching dark colors. Apply themes to `<html>` so portaled
content inherits them; scoped themes use the content component's `container` prop.

The [introduction guide](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/introduction-overview--getting-started)
covers fonts, dark mode, and scoped portals. Browse the
[interactive token catalog](https://elegant-hotteok-cbb834.netlify.app/?path=/story/design-tokens--overview)
or read the defaults in [tokens.css](src/styles/tokens.css).

## Spacing

Use `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, and `3xl` for spacing,
control and icon sizes, and offsets. The precompiled `styles.css` includes padding,
margin, and gap utilities such as
`p-3xs`, `px-md`, `mt-lg`, `-mt-xs`, and `gap-sm`. With the Tailwind 4 token
import, you can generate responsive variants such as `md:gap-lg`.

```tsx
<div className="grid p-md gap-sm">Your content</div>
```

Both CSS exports include the custom properties. In plain CSS, use
`gap: var(--space-sm)` or override `--space-sm` on a wrapper to change that
named step for its descendants. Use a named token for dimensions and offsets
where it fits, such as `width: var(--space-xl)`. Use an explicit pixel value for
a measurement outside the scale, such as `width: 288px`. The named defaults
use `rem` and range from 2px to 64px at a 16px root font size.

**Deprecated.** Numeric spacing tokens such as `--space-0`, `--space-1-5`, and
`--space-4` remain exported and continue to affect existing components and
consumer styles. For new styles, use the named scale, such as `--space-md` for
the default value of `--space-4`, or plain `0` for a reset. See the
[spacing catalog](https://elegant-hotteok-cbb834.netlify.app/?path=/story/design-tokens--spacing)
for the full scale.

## Development

Use Node 24 and the committed npm lockfile:

```bash
nvm use
npm ci
npm run storybook
```

Storybook runs at [localhost:6006](http://localhost:6006). Run `npm run check`
for project validation, then `npm run test:browser` for Playwright checks.

For repeatable palette, contrast, and theme validation, see the
[theme audit runbook](docs/theme-audit.md) and run `npm run audit:themes`.

See [Contributing](CONTRIBUTING.md) for build commands, Netlify hosting, upstream
sources, and release guidance.

## License

[MIT](LICENSE) © 2026 Carlos Contreras. See
[Third-party notices](THIRD_PARTY_NOTICES.md) for upstream attribution.
