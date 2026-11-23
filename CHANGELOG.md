# @darthcharles/greda

## 2.0.0

### Major Changes

- 315cf52: Migrate component spacing, dimensions, and offsets to the named scale. Some defaults change as values snap to the nearest named step. Update component overrides from numeric tokens to the named step the component uses. For example, override `--space-md` for Button’s horizontal padding and `--space-xl` for its default height.

  Remove the 19 deprecated numeric `--space-*` custom properties and their Tailwind 4 aliases from the CSS exports. Replace references such as `var(--space-4)` with `var(--space-md)`. Numeric utilities such as `p-4` still use `--spacing-unit` when compiled with Greda’s Tailwind 4 token import. See the README for the token migration map.

  `max-w-lg` now resolves to `--space-lg` in the precompiled and Tailwind 4 builds. Use `--dialog-width` to customize Dialog, or `max-w-[var(--dialog-width)]` when applying the same cap to other elements in a Tailwind build.

### Minor Changes

- 88d0a96: Extend the named spacing scale to sizing, positioning, and other spacing-based Tailwind utilities in the precompiled stylesheet. Classes such as `size-md`, `h-xl`, and `-translate-y-xs` use the same named tokens as the Tailwind 4 integration. Greda's `cn` helper merges these classes with numeric and arbitrary overrides.
- d0dcaa2: Add nine named spacing tokens from `--space-3xs` to `--space-3xl`. Use them in plain CSS or with padding, margin, and gap utilities such as `p-md`, `-mt-xs`, and `gap-sm`. The utilities ship in the precompiled stylesheet and are available through the Tailwind 4 token import.

## 1.6.0

### Minor Changes

- 3c20abd: Add RadioGroup and RadioGroupItem with public prop types, Radix keyboard navigation, controlled and uncontrolled selection, native form support, and themed focus, disabled, and validation styles.
- f292c57: Add Collapsible, CollapsibleTrigger, and CollapsibleContent with public prop types, controlled and uncontrolled disclosure state, keyboard interaction, disabled support, and Button composition through asChild.

### Patch Changes

- d406b73: Use the existing surface-raised background for Input, Textarea, SelectTrigger, ComboboxInput, Checkbox, and RadioGroupItem across all themes. Preserve checkbox checked and indeterminate fills, existing borders, focus, disabled, and invalid states, with no palette changes.

## 1.5.1

### Patch Changes

- f0ddaac: Rebalance Comal's entire neutral palette, including white, black, every gray shade, and secondary controls, toward warm ivory, tan stone, and charcoal in both color schemes. Lighter surfaces and less saturated neutrals reduce the brown cast while a soft tan undertone, terracotta actions, clay interaction fills, sage accents, and typography preserve the theme's identity. Consumers using the Comal theme will see the updated colors without changing imports or token names.

## 1.5.0

### Minor Changes

- 4349a97: Expose Lucide icons and types through `@darthcharles/greda/icons`, preserving
  native SVG props, refs, and tree shaking without a separate consumer dependency.
  Add an Iconography guide with common icons, sizing, stroke, and accessible
  composition examples.

## 1.4.3

### Patch Changes

- a715c85: Fix field-border and supporting-surface text contrast in Base, Cobalto, Matrix, and La Viuda in light and dark schemes. Preserve the light neutral palettes' tonal ordering and explicitly retain readable dark supporting text. Token names, theme attributes, and component APIs remain compatible; affected palettes render stronger borders and adjusted text/action colors.

  The Matrix composition recipe now respects the selected light/dark scheme.

- eff3c6b: Separate Comal's sage supporting panels, warm neutral secondary controls, and clay interaction fills. Give Cobalto a stronger blue interaction fill while retaining readable supporting text, errors, and borders. Preserve existing token names and APIs. Extend the saved theme audit with rendered hover-feedback checks and an interactive role preview for reviewing visual hierarchy.
- a715c85: Fix Comal text, field-border, and button hover contrast across light and dark supporting surfaces, and restore the light gray palette's tonal ordering. Remove hover background changes from noninteractive Badge variants so status text retains its contrast. Existing theme attributes, tokens, and component props remain compatible.

## 1.4.2

### Patch Changes

- f04aeac: Lighten Comal's light-mode primary and hover colors toward terracotta inspired by Mexican cazuelas, preserving contrast with cream labels.

  Change Comal's tertiary surface from amber to pale sage in light mode and muted olive in dark mode. Keep tertiary surface and interaction accent tokens independently customizable.

  Soften Comal's light-mode secondary color to sage so supporting badges and buttons have less visual weight while retaining readable dark text.

## 1.4.1

### Patch Changes

- 2b0f08d: Give the default Base theme a distinct hover and focus accent in both light and
  dark modes. Secondary controls keep their existing neutral surfaces, while
  interactive highlights use a separate blue-gray shade. Token names and role
  assignments remain unchanged.
- 2b0f08d: Give Comal's accent its own green shade in light and dark modes, distinct from
  secondary controls. Hover and focus backgrounds now provide a separate visual
  cue while secondary buttons and badges retain their moss-green surfaces.
- 2b0f08d: Separate La Viuda's hover and focus accent from its secondary surface in both
  light and dark modes. Secondary controls retain their existing soft green;
  interactive highlights now use a distinct green shade.

## 1.4.0

### Minor Changes

- e10dc55: Add the optional La Viuda theme with cream surfaces, chile-red actions, soft
  greens, Geist font references, modest corners, and a complementary dark palette.
  Import `@darthcharles/greda/themes/la-viuda.css` after Greda styles and select
  `data-theme="la-viuda"` with a color scheme on the same boundary. Font loading
  remains the consuming application's responsibility.

  Add a fictional ranch composition recipe, translate Comal and Cobalto examples
  into English, and standardize all recipe guides around theme character, setup,
  full example source, interaction guidance, and scoped themes. Page examples include a few contextual controls. Palettes remain
  in the Tokens catalog.

### Patch Changes

- e10dc55: Refine Comal into a more earthy palette: clay-colored backgrounds, sienna-brown
  actions, amber surfaces, moss-green glaze accents, and dark fired-clay surfaces inspired by
  Mexican cazuelas de barro.
  Typography, shape, token names, and role assignments remain the same. This
  intentionally changes the preset's appearance; applications requiring the former
  palette can retain it through their own `--base-*` color overrides.

## 1.3.1

### Patch Changes

- 13c0422: Fix Button and buttonVariants resizing when changing variants. Previously
  borderless auto-width buttons may be approximately 2px wider; fixed-size buttons
  retain their existing bounds.

  Buttons with aria-pressed, whether true or false, no longer animate selection
  changes or move while pressed. Ordinary action-button feedback, popup-trigger
  exclusions, and reduced-motion behavior are preserved. No prop migration is
  required; use aria-pressed for toggle controls.

## 1.3.0

### Minor Changes

- 55d0782: Add the optional Matrix theme with green light and dark palettes, system monospace typography, and square controls. Import `@darthcharles/greda/themes/matrix.css` and select `data-theme="matrix"` with an explicit color scheme. Includes a terminal-inspired Storybook recipe.
- d95e035: Add a composable Combobox with local filtering, externally controlled remote results, and optional synchronous or asynchronous option creation. Includes keyboard navigation, form submission and validation, scoped theme portals, and customizable loading/error states. Uses existing Radix and React dependencies and preserves the Select API.

  Keep filtered results stable during popup dismissal so clearing the search does not flash the full option list during the closing animation.

## 1.2.0

### Minor Changes

- a8a579e: Add a popover adapted from shadcn/ui New York and built on Radix, with composable trigger, anchor, content, and close components, controlled or uncontrolled state, collision-aware placement, accessible focus management, reduced-motion-aware animations, and scoped portal support.

## 1.1.0

### Minor Changes

- f956784: Add the optional `themes/cobalto.css` export with scoped light/dark palettes,
  Arial/Helvetica typography, and square corners. Keep the default theme neutral.
  Include Storybook selection and a complete editorial composition recipe.

  Export the existing Comal palette as `themes/comal.css`, shared with Storybook.
  Font loading remains optional and belongs to the consuming application.
  Include a Comal composition recipe with a responsive fictional workshop page,
  font setup and copyable Tailwind JSX. Both recipes use consumer-generated
  Tailwind utilities rather than separate layout stylesheets.

- f956784: Add shared display, title, body, label, caption and eyebrow typography utilities
  with themeable tokens. Ship them in compiled CSS and the Tailwind 4 token
  integration, preserving size utilities and independent text colors. Update class
  merging, token previews and both theme recipes to use the shared roles.

## 1.0.0

### Major Changes

- 2a241cd: Introduce a generic base palette: primary, primary-hover, secondary, accent,
  destructive, white, black, and eight selected gray steps. Consumers override only
  `--base-*` colors. Greda owns independent surface, text, border, and component
  role assignments, rebinding them at root, theme, and scheme boundaries so scoped
  base overrides work without consumer role declarations.

  Generate category utilities for compiled CSS and Tailwind 4, including opacity
  and state variants, and merge surface/background overrides through `cn`. Comal
  uses the same base names; no brand- or hue-specific color variables are exposed.

  Breaking changes: `text-primary`, `text-secondary`, `text-muted`,
  `border-primary`, and `border-secondary` now use category roles rather than the
  identically named action color. Use `text-action` / `border-action` for actions.
  Migrate theme color overrides to `--base-*` (for example, `--primary` to
  `--base-primary`); component tokens remain as derived values. Consolidating the
  neutral palette changes some surface and foreground defaults. Tooltip uses
  inverse surface/text roles.

  Document base-only theming and migration. Organize Storybook into an Overview,
  Base colors, Color roles, and focused foundation pages. Put brand/state colors
  before neutrals and show role assignments in tables with live examples. Keep
  internal component aliases out of the catalog. Add browser coverage for
  base-only root/scoped overrides, themes, opacity, states, and responsive utilities.

  Consolidate Introduction into one Getting started guide with an embedded live
  component example, focused setup/theming instructions, and expandable optional
  setup and migration details. Preserve the component preview story ID, disable
  duplicate autogenerated Introduction docs, and update guide links.

### Minor Changes

- 827a509: Add the surface-tertiary role and utility, derived from an independently
  overridable --base-tertiary color. Base uses soft blue, while Comal uses light
  green, with darker counterparts for both themes. Tertiary-specific customization
  uses --base-tertiary instead of --base-accent, leaving accent and hover colors
  independent. Include compiled state utilities, Tailwind 4 integration, background
  class merging, and a Color roles example.

## 0.2.0

### Minor Changes

- BREAKING: Replace the `ds-` utility prefix with standard Tailwind class names
  throughout components, variant helpers, compiled CSS, and `cn` conflict resolution.
  Greda and consuming applications now use the same classes and CSS tokens.

  Migrate consumer class names and selectors: `ds-bg-primary` becomes `bg-primary`,
  `hover:ds-bg-primary-hover` becomes `hover:bg-primary-hover`, and `-ds-mx-1`
  becomes `-mx-1`. Existing `ds-*` classes are no longer generated or merged.
  Component props, exports, and token names and formats are unchanged.

  The stylesheet now guarantees background, text, and border utilities for every
  semantic color, including hover, focus, and focus-visible variants. These class
  names are global and can overlap with application utilities; align the app's
  Tailwind theme with Greda's CSS variables and review matching class names when
  upgrading. Global preflight remains disabled and baseline/variable initialization
  remains scoped to `.comal-ui`.

  The `tokens.css` export now includes a Tailwind 4 theme. Import it after
  `@import "tailwindcss"` in the consuming app's CSS entry point to generate
  token-based utilities without copying configuration. When using Greda components
  too, import `styles.css` into `layer(components)` before the token import and
  remove any JavaScript import of the same component stylesheet. Responsive and
  opacity variants generated by the app can then override component styles.

  Runtime CSS variables remain available without Tailwind. The package still builds
  its own component CSS with Tailwind 3; Tailwind 4 is only needed in consumer apps
  using the CSS theme integration. A shared mapping now drives the packaged color
  safelist and Tailwind 4 aliases instead of maintaining a separate list of classes.
