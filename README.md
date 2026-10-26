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

The stylesheet includes the base theme and scoped component styles. Your
application controls page layout, backgrounds, and fonts. React and React DOM
remain peer dependencies outside the ESM bundle.

Visit [Storybook](https://elegant-hotteok-cbb834.netlify.app/) for component APIs,
variants, interaction examples, and accessibility guidance.

## Theming

Import your theme after the package stylesheet and override the tokens you need.
Unspecified values keep their base defaults:

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
