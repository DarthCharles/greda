# Greda

React components with a neutral base theme and CSS tokens you control.

Built from shadcn/ui New York and Radix primitives, Greda ships typed,
composable components with compiled styles. Use it with React 18 or 19,
without configuring Tailwind in your application.

[Quick start](#quick-start) · [Components](#components) · [Theming](#theming) ·
[Design tokens](#design-tokens) · [Development](#development)

## Quick start

### Install

Add Greda to an existing React application:

```bash
npm install @darthcharles/greda
```

Requires `react` and `react-dom` **18.2+ or 19**. Both are peer dependencies
and remain outside the ESM bundle. TypeScript declarations are included.

### Import the styles

Load the compiled stylesheet once at your application's entry point:

```tsx
import "@darthcharles/greda/styles.css";
```

The stylesheet includes the base theme and component styles. The baseline reset
and Tailwind variable initialization are scoped to `.comal-ui`, which the
components apply themselves. Your application controls page layout, backgrounds,
and fonts; the package downloads no external fonts.

### Use a component

```tsx
import { Button, Input, Label } from "@darthcharles/greda";

export function NameField() {
  return (
    <form>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" />
      </div>
      <Button type="submit">Continue</Button>
    </form>
  );
}
```

## Components

Components follow shadcn's composition model, with Radix handling keyboard
interaction and ARIA behavior. Import components and their types from
`@darthcharles/greda`.

Each linked story includes usage examples, relevant variants and states, and
keyboard documentation. Run `npm run storybook` to browse them locally.

| Component | API at a glance | Examples |
| --- | --- | --- |
| Button | Six variants; `default`, `sm`, `lg`, and `icon` sizes; `loading` and `asChild` | [Button](src/stories/Button.stories.tsx) |
| Input | Native input props and refs | [Input](src/stories/Input.stories.tsx) |
| Textarea | Native textarea props and refs | [Textarea](src/stories/Textarea.stories.tsx) |
| Label | Label associated with a control through `htmlFor` | [Label](src/stories/Label.stories.tsx) |
| Select | Trigger, value, content, groups, labels, items, separators, and scroll buttons; `onValueChange` | [Select](src/stories/Select.stories.tsx) |
| Checkbox | Boolean or `indeterminate` state; `onCheckedChange` | [Checkbox](src/stories/Checkbox.stories.tsx) |
| Dialog | Trigger, content, title, description, header, footer, close, overlay, and portal | [Dialog](src/stories/Dialog.stories.tsx) |
| Card | Header, title, description, content, and footer | [Card](src/stories/Card.stories.tsx) |
| Badge | `default`, `secondary`, `outline`, and `destructive` variants | [Badge](src/stories/Badge.stories.tsx) |
| Tabs | List, trigger, and content; horizontal or vertical orientation | [Tabs](src/stories/Tabs.stories.tsx) |
| Toast | Provider, viewport, title, description, action, and close; controlled open state | [Toast](src/stories/Toast.stories.tsx) |
| Tooltip | Provider, trigger, and content | [Tooltip](src/stories/Tooltip.stories.tsx) |

### Usage conventions

- **Buttons:** variants are `default`, `secondary`, `outline`, `ghost`,
  `destructive`, and `link`. The default type is `button`; use `type="submit"`
  in forms. `loading` sets `aria-busy` and disables native buttons. Use a useful
  label such as `Saving…`. With `asChild`, the child keeps its semantics;
  links do not gain native disabled behavior.
- **Forms:** associate labels with controls. Connect errors with `aria-invalid`
  and `aria-describedby`, and give icon buttons accessible names.
- **Dialogs:** include a `DialogTitle`. Add a `DialogDescription`, or pass
  `aria-describedby={undefined}` to `DialogContent` when omitting it. Content
  includes an accessible close button.
- **Notifications:** supply a `ToastProvider` and `ToastViewport`, and control
  each toast's open state. Keep critical errors inline rather than relying only
  on a toast or tooltip.

Use `className` for application styling. The exported `cn` helper combines
conditional classes and resolves conflicting `ds-` Tailwind utilities:

```tsx
import { cn } from "@darthcharles/greda/utils";
```

`cn` is also available from the package root. Component utilities use the `ds-`
prefix, such as `ds-px-4`. Only utilities used by the library's component source
are guaranteed to appear in its compiled CSS; use application CSS for your layout.

## Theming

Override the tokens your application needs. Unspecified values keep their base
defaults. Import your theme stylesheet after the package stylesheet:

```tsx
import "@darthcharles/greda/styles.css";
import "./theme.css";
```

```css
/* theme.css */
:root {
  --primary: 9.500 55.556% 42.353%;
  --primary-hover: 9.714 56.150% 36.667%;
  --primary-foreground: 0 0% 100%;
  --ring: 9.500 55.556% 42.353%;
  --radius: 0.75rem;
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
}
```

Colors use **space-separated HSL channels**, without an `hsl()` wrapper.
`--overlay` also includes alpha, for example `222 47% 11% / 0.4`.
Other tokens accept ordinary CSS values. Keep background and foreground pairs
readable and verify contrast in your theme.

Base token selectors use `:where()`, so ordinary consumer selectors take
precedence even if the library stylesheet loads later. Token names and value
formats are part of the public API.

### Dark mode

Opt into the base dark palette by setting the color scheme on the document root:

```html
<html lang="en" data-color-scheme="dark">
```

Brand identity and color scheme are independent. If your brand overrides base
colors, provide matching dark overrides in `:root[data-color-scheme="dark"]`.

### Portals and scoped themes

Apply themes to `<html>` so portaled dialogs, selects, and tooltips inherit
the same tokens. For a theme scoped to a subtree, pass its element to the
`container` prop on `DialogContent`, `SelectContent`, or `TooltipContent`.

See the [theming guide](src/stories/Theming.mdx) for a complete walkthrough,
including fonts, dark palettes, and scoped portals. The
[Comal theme](.storybook/themes/comal.css) is a Storybook example with locally
hosted DM Sans and Fraunces; its branding and fonts are excluded from the package.

## Design tokens

Tokens cover semantic colors, typography, spacing, radii, shadows, focus,
motion, dimensions, and stacking. Storybook's **Design Tokens** section shows
live previews that respond to the theme and color-scheme toolbar.

Spacing steps derive from `--spacing-unit` (`0.25rem` by default): `--space-1`
is 4px, `--space-2` is 8px, and `--space-4` is 16px. Fractional names use a
hyphen, such as `--space-0-5` for 2px. Override an individual step to adjust
component utilities that use it:

```css
:root {
  --space-4: 1.25rem;
}
```

Use root overrides to scale the spacing system. Derived steps are computed where
they are declared; changing only `--spacing-unit` on a nested wrapper does not
recalculate inherited steps. Breakpoints are build-time layout choices, rather
than CSS variable tokens. Dialog and toast content remain viewport-constrained.

`@darthcharles/greda/tokens.css` provides the tokens separately when you only
need the variables. They are already included in `styles.css`.

Browse [Design Tokens in Storybook](http://localhost:6006/?path=/story/design-tokens--overview)
with `npm run storybook`, or read the defaults in
[src/styles/tokens.css](src/styles/tokens.css).

## Development

Use **Node 24**, as specified in `.nvmrc`, and npm with the committed lockfile.

```bash
nvm use
npm ci
npm run storybook
```

Storybook runs at **http://localhost:6006** with component examples, automatic
prop documentation, an axe panel, and base/Comal and light/dark toolbar options.

### Validation

```bash
npm run check
npm run test:browser
```

`check` runs type checking, Vitest, story validation, the package build, package
validation, and the static Storybook build. **Playwright runs separately** through
`test:browser` and requires up-to-date `dist/` and `storybook-static/` outputs;
run `check` first.

Browser tests serve the static catalog on port **6007** and check rendering,
accessibility, themes, portals, and CSS isolation. Local runs use installed
Google Chrome; CI installs Playwright Chromium.

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Check TypeScript types |
| `npm test` | Run interaction and unit tests |
| `npm run validate:stories` | Validate component story coverage |
| `npm run build` | Build ESM, declarations, and compiled CSS into `dist/` |
| `npm run validate:package` | Validate the built package |
| `npm run build-storybook` | Build the catalog into `storybook-static/` |
| `npm pack` | Build and create a local package archive |

### Hosting on Netlify

The hosted website is the Storybook catalog. [netlify.toml](netlify.toml)
configures Netlify to build it with `npm run build-storybook` and publish
`storybook-static` from the repository root. The `dist/` directory contains
the installable library rather than the website.

Connect this repository in Netlify and select `main` as the production branch.
Netlify reads Node 24 from `.nvmrc`. Keep development dependencies enabled:
Storybook, Vite, and the example fonts are needed at build time. No application
secrets or environment variables are required for the catalog.

For an existing project, check that its base directory is the repository root
and that the deploy log uses the command and publish directory above. After
pushing configuration changes, trigger a new deploy. File-based build settings
override corresponding Netlify UI settings.

### Upstream sources

Greda maintains customized React 18-compatible copies of shadcn/ui New York
components, built with Tailwind CSS 3.4. [components.json](components.json)
records the aliases, stylesheet, style, and prefix configuration. Original
registry responses, hashes, and the upstream license are preserved in
[upstream/shadcn-ui](upstream/shadcn-ui/).

`node scripts/fetch-shadcn.mjs` refreshes the snapshots and manifest without
changing local components. Compare upstream changes against those snapshots and
preserve local adaptations; review CLI updates before accepting overwrites.

### Versioning and publishing

Add a Changeset with `npm run changeset` for publishable changes. Use patch
versions for fixes and minor versions for compatible features. Breaking prop,
token, or export changes require explicit migration notes and a minor bump before
1.0, or a major bump after 1.0.

For a requested release, `npm run version-packages` prepares versions and
changelogs. `npm run release` validates and publishes through Changesets using
the maintainer's npm credentials. Publishing requires an explicit release action.

## License

[MIT](LICENSE) © 2026 Carlos Contreras. Adapted components retain their upstream
attribution; see [Third-party notices](THIRD_PARTY_NOTICES.md) and the
[shadcn/ui license](upstream/shadcn-ui/LICENSE.md).
