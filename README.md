# Greda

Composable React components with a neutral base theme and CSS tokens you control.
Built from shadcn/ui New York and Radix primitives, with compiled styles and
TypeScript declarations. Supports React 18 and 19; no Tailwind setup required.

**[Explore Storybook](https://elegant-hotteok-cbb834.netlify.app/)** ·
[Theming guide](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/introduction-overview--theming) ·
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
`bg-primary`, `text-foreground`, and `border-primary`. Pass them through
`className` to override component defaults. See the theming guide for supported
utilities and migration from `ds-*` classes.

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

## Theming

Customization is optional. To change the default theme, import your own
`theme.css` after the package stylesheet and override only the tokens you need.
Unspecified values keep their base defaults, and components and color utilities
automatically use your overrides:

```css
/* theme.css */
:root {
  --primary: 9.500 55.556% 42.353%;
  --primary-hover: 9.714 56.150% 36.667%;
  --primary-foreground: 0 0% 100%;
  --ring: 9.500 55.556% 42.353%;
  --radius: 0.75rem;
}
```

Colors use space-separated HSL channels without an `hsl()` wrapper;
`--overlay` also includes alpha. Other tokens accept ordinary CSS values.

Spacing tokens such as `--space-4` are shared distances for padding, margin, and
gap. Use them directly in your own CSS when needed; layout rules are optional
examples, not theme setup. If you only need tokens, import
`@darthcharles/greda/tokens.css` instead of `styles.css`.

Set `data-color-scheme="dark"` on `<html>` for the base dark palette. Brand
overrides need matching dark colors. Apply themes to `<html>` so portaled
content inherits them; scoped themes use the content component's `container` prop.

The [theming guide](https://elegant-hotteok-cbb834.netlify.app/?path=/docs/introduction-overview--theming)
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
