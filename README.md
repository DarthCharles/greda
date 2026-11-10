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

## Toggle buttons

Use `aria-pressed` on `Button` (or markup styled with `buttonVariants`) for
selection controls. Both `true` and `false` states disable the default selection
transition and press movement. Ordinary action buttons retain press feedback;
popup triggers and reduced-motion preferences continue to suppress movement.
Button variants reserve the same border space, so switching `outline` and
`secondary` does not change the button's size. Previously borderless auto-width
buttons gain approximately 2px of width; fixed-size buttons reserve that space
inside their existing bounds.

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
<div className="bg-primary p-4 text-primary-foreground hover:bg-primary-hover">
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
element. It uses warm neutrals, terracotta actions and rounded corners. Its font
stacks reference DM Sans and Fraunces; load those fonts in your application or
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
Primary text and borders use their neutral base assignments independently.
Dark assignments are built in. Define base overrides on `:root` or a
`data-theme` element; scoped themes automatically rebind the role variables.
Consumers do not need to declare surface, text, or border tokens.
`surface-tertiary` uses `--base-tertiary`: soft blue (`#eff6ff`) in Base and
light green (`#e8eee0`) in Comal, with darker counterparts in dark mode.
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

Spacing tokens such as `--space-4` are shared distances for padding, margin, and
gap. Use them directly in your own CSS when needed; layout rules are optional
examples, not theme setup. If you only need tokens, import
`@darthcharles/greda/tokens.css` instead of `styles.css`.

Set `data-color-scheme="dark"` on `<html>` for the base dark palette. Brand
overrides need matching dark colors. Apply themes to `<html>` so portaled
content inherits them; scoped themes use the content component's `container` prop.

The [introduction guide](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/introduction-overview--getting-started)
covers fonts, dark mode, and scoped portals. Browse the
[interactive token catalog](https://elegant-hotteok-cbb834.netlify.app/?path=/story/design-tokens--overview)
or read the defaults in [tokens.css](src/styles/tokens.css).

## Development

Use Node 24 and the committed npm lockfile:

```bash
nvm use
npm ci
npm run storybook
```

Storybook runs at [localhost:6006](http://localhost:6006). Run `npm run check`
for project validation, then `npm run test:browser` for Playwright checks.

See [Contributing](CONTRIBUTING.md) for build commands, Netlify hosting, upstream
sources, and release guidance.

## License

[MIT](LICENSE) © 2026 Carlos Contreras. See
[Third-party notices](THIRD_PARTY_NOTICES.md) for upstream attribution.
