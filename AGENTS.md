# Agent Guide

These instructions apply to the entire repository. Base changes on the existing
code and `README.md`; if you find a discrepancy, explain it and update the affected
documentation as part of the change.

## Purpose and architecture

`@darthcharles/greda` is a reusable React and TypeScript library with components
adapted from shadcn/ui New York, Radix primitives, and Tailwind CSS 3.4. It ships
ESM, type declarations, and compiled CSS. Consumers do not need to configure
Tailwind. Preserve the declared compatibility with React 18 and 19.

| Path | Responsibility |
| --- | --- |
| `src/components/ui/` | Public components and their variants |
| `src/index.ts` | Public package exports |
| `src/lib/utils.ts` | `cn`: conditional classes and Tailwind conflict resolution |
| `src/styles/tokens.css` | Source of truth for tokens and base palettes |
| `src/styles/styles.css` | Scoped baseline, utilities, and reduced motion |
| `tailwind.config.ts` | Mapping tokens to compiled utilities |
| `src/styles/tailwind-theme.ts` | Shared token mappings for package CSS and Tailwind 4 consumers |
| `scripts/tailwind-theme.mjs` | Generating Tailwind 4 theme directives for `tokens.css` |
| `src/stories/` | Examples, documentation, and token catalog |
| `src/styles/themes/` | Optional exported brand themes (Comal, Cobalto, Matrix, La Viuda, and Workbench) |
| `.storybook/` | Configuration, catalog styles, and example font loading |
| `src/components/behavior.test.tsx` | Interaction tests with Testing Library |
| `tests/storybook.spec.ts` | Browser, axe, theme, and package CSS tests |
| `scripts/` | Build, validation, and documentation generation |
| `upstream/shadcn-ui/` | Original snapshots, hashes, manifest, and license |

## Working practices

- Review the affected files and their consumers before editing. Check `git status`
  and preserve the user's changes.
- Keep changes focused on the task. Avoid unrelated refactors, new dependencies,
  and version upgrades.
- Use Node 24 as specified in `.nvmrc`, and npm with `package-lock.json`. Install
  from the lockfile with `npm ci`; update the lockfile when changing dependencies.
- Follow the existing style: strict TypeScript, two spaces, double quotes,
  semicolons, kebab-case component filenames, and PascalCase story filenames.
- Do not introduce `any`, type suppressions, or abstractions without a concrete
  need. There are currently no lint or formatting scripts; do not invent commands.
- Do not manually edit or commit generated artifacts: `dist/`, `storybook-static/`,
  `test-results/`, `playwright-report/`, `coverage/`, or `.tgz` files.
- When delivering changes, explain what changed, what you verified, and any actual
  limitations. Do not claim to have run a check you did not execute.

## Components and public API

- Before editing for a new component, check `components.json` and the matching
  shadcn/ui snapshot and manifest entry in `upstream/shadcn-ui/`. If its snapshot
  is missing, open the official New York registry item and its usage docs before
  choosing a primitive. Use the source and documented behavior to identify the
  public API, interaction, and dependencies. A similar local component is a
  reference for Greda conventions.
- In your first update after that review, name the upstream source, the primitive
  it uses, and any Greda adaptations that would change its behavior. Prefer the
  upstream implementation adapted to Greda's tokens, composition, and React
  support. If matching upstream requires a new runtime dependency, explain what
  it provides and verify its React 18 and 19 support before deciding. If the
  upstream item is unavailable, say so and identify the source you can use.
- Follow the shadcn/Radix composition model. Reuse their primitives for focus,
  keyboard interaction, and accessible states before implementing custom behavior.
- Preserve native props, events, `aria-*`/`data-*` attributes, and refs. Use
  `React.forwardRef` and `displayName` as existing components do; avoid React 19
  exclusive APIs while React 18 remains supported.
- Use `cn` from `src/lib/utils.ts`, placing the consumer's `className` after default
  classes. Use `cva` for variants where appropriate.
- Export public components and types from `src/index.ts`. Also review
  `package.json`, `vite.config.ts`, and `tsconfig.build.json` when changing entry
  points, external dependencies, or public subpaths. Keep React out of the bundle.
- Preserve local contracts: `Button` defaults to `type="button"`; `loading` sets
  `aria-busy` and disables native buttons. `asChild` preserves the child element's
  semantics and does not guarantee that links are disabled.
- Preserve `container` on portaled Dialog, Select, and Tooltip content so they can
  inherit themes scoped to a subtree.
- Props, exports, variants, and token names/formats are public API. Avoid silent
  breaking changes; document their impact and migration steps.

## Styles and tokens

- Use unprefixed utilities, including modifiers such as
  `hover:bg-primary`. Keep class names complete and static so Tailwind can
  detect them; avoid building utility names through interpolation.
- The package build scans `src/components/ui/` and derives its public semantic
  background, text, and border color safelist from the shared theme mapping,
  including hover, focus, and focus-visible variants. Complete typography roles
  are also shipped through the shared mapping; keep their class merging and
  Tailwind 4 utilities in sync. Storybook additionally scans
  the theme recipe stories through the explicit `@config` in
  `.storybook/styles.css`, using the shared PostCSS transforms.
  Other catalog-only styles belong in Storybook CSS; a class used only in a story is not guaranteed to appear in the
  published CSS.
- `tokens.css` includes runtime variables and Tailwind 4 theme directives. Test
  the actual CSS imports through the consumer compiler in `tests/tailwind-consumer.ts`.
  Keep the development-only Tailwind 4 alias separate from the package's Tailwind
  3 build. With Tailwind 4, import component styles in `layer(components)` so app
  utilities can override them; do not reintroduce an unlayered duplicate.
- Keep `.comal-ui` on elements that need the baseline, including overlays, portaled
  content, and public variant helpers.
- Preserve `preflight: false` and the scoping of `--tw-*` initializers in
  `scripts/scope-tailwind-defaults.cjs`, shared by the package and Storybook.
  Importing the CSS must not reset unrelated elements. Unprefixed utilities are
  shared with consumers and apply globally to elements using those class names.
- Use semantic tokens for colors, typography, spacing, and states. Prefer extending
  an existing token over introducing repeated fixed visual values.
- Define colors as space-separated HSL channels without an `hsl()` wrapper;
  `--overlay` includes alpha. Other tokens accept CSS values.
- Preserve low specificity with `:where()` so consumer overrides work regardless
  of stylesheet import order.
- Keep brand themes separate from `data-color-scheme="dark"`. The base theme is
  neutral; brand palettes belong in optional theme exports. Font loading belongs
  in Storybook or the consuming application. Do not add font downloads to the package.
- When changing tokens, review the dark palette, Tailwind mapping, and token
  classification/previews in `src/stories/tokens/`. Storybook reads the token
  stylesheet directly; keep the README focused on usage and reference links.
- Preserve viewport constraints on overlays, visible focus, and support for
  `prefers-reduced-motion`.

## Accessibility and documentation

- Write all examples, recipe content, and documentation in English. Preserve
  public theme names and identifiers.
- Keep theme recipes small, illustrative Storybook compositions. Group Greda
  components that naturally belong together and show how the theme styles
  them in context. Static example content is sufficient. Include interaction
  only when it helps demonstrate a themed component or state.
- Keep recipe documentation consistent: a theme-focused overview, Install the
  theme and fonts, Compose the page, Responsive layout and interaction, and
  Scoped themes. Describe colors, typography, shape, and visual emphasis in the
  overview; introduce the fictional site only as a composition example. Keep
  example layouts distinct. Color palettes belong in the Tokens catalog; do not
  repeat reference palettes in recipe guides. When tables are needed, use
  semantic HTML tables in MDX, as in the existing component guides.
- Use semantic elements and accessible names. Associate labels with controls and
  errors with `aria-invalid` and `aria-describedby`. Icon buttons need an
  accessible name.
- Dialog requires a title; include a description or pass
  `aria-describedby={undefined}` when omitting it. Preserve Escape handling, focus
  trapping, and focus restoration to the trigger.
- Do not use Tooltip or Toast as the only way to communicate critical errors.
  Maintain readable contrast across base/Comal themes and light/dark schemes.
- Every new component needs its own `src/stories/Name.stories.tsx` with
  `export const Default`. Use `satisfies Meta<typeof Component>` and `StoryObj`,
  and import the API from `src/index.ts` as existing stories do.
- Document variants, sizes, keyboard interaction, and applicable states: disabled,
  loading, validation, or indeterminate. Do not invent states for noninteractive
  components.
- Update stories and README when changing public usage. Preserve story IDs used
  by Playwright or update their references in the same change.

### Component documentation patterns

- Keep scoped-theme usage in the shared introduction and theme recipe guides.
  Do not add dedicated scoped-theme stories. Use browser test fixtures to
  verify theme inheritance for portaled components.
- Use the shared autodocs page in `.storybook/preview.tsx`: introduction, default
  example, component props, then named examples. Do not introduce a component-specific
  docs layout when the shared page covers the component.
- Follow `Input.stories.tsx`, `Select.stories.tsx`, and `Button.stories.tsx`:
  keep the component introduction focused on purpose, essential composition,
  labeling, and keyboard behavior. Avoid a single paragraph listing the entire API.
- Put prop-specific contracts, defaults, and composition caveats in `argTypes`,
  as Button does. Describe the prop on the component that owns it; do not present
  child props as root props. Supply explicit controls and defaults where useful.
  A default example accepting args must pass supported args to its component.
  Disable controls that cannot work with that example's composition.
- Put state-specific explanations beside the example using
  `parameters.docs.description.story`. Explain what the reader can try and any
  relevant constraint. Keep the default example small and name other examples
  after meaningful states or composition patterns. The shared page does not show
  Default's story description when there are multiple stories; put essential
  default-usage guidance in the introduction or a relevant named example.
- Reuse `catalog-stack`, `catalog-row`, `catalog-field`, `catalog-muted`, and
  `catalog-error` for examples. Check `.storybook/preview.css` before adding a
  catalog class. Examples import components from `../index` and icons from
  `../icons`; consumer code snippets use published package imports.
- For guidance too extensive for autodocs, follow `Combobox.mdx`: attach a
  `Usage guide` with `Meta of={ComponentStories}`, explain composition and basic
  usage, then add only applicable state, form, keyboard, and appearance sections.
  Embed existing examples with `Canvas` and use semantic HTML tables. Do not
  create a second API inventory or duplicate the autogenerated props table.
- Keep README component entries brief: purpose, essential public contract, and
  a link to the reference or usage guide. Installation and stylesheet setup
  belong in Quick start; detailed examples and state guidance belong in Storybook.
- Review documentation copy, links, examples, and the rendered shared docs page.
  Do not add tests for headings, wording, section order, or other presentation
  details. Keep existing story IDs stable when revising documentation.

## Validation appropriate to the change

| Change | Validation |
| --- | --- |
| Documentation only | Review paths, commands, links, and examples for accuracy |
| Tests only | Run the affected test suites; reuse current build outputs when their inputs have not changed |
| Components, types, or behavior | `npm run typecheck`, `npm test`, `npm run validate:stories` |
| Tokens | Review Storybook token classification/previews; validate as a visual change |
| CSS, themes, portals, or visual changes | `npm run check`, then `npm run test:browser` |
| Build, dependencies, or exports | `npm run check`; also browser tests if runtime or CSS is affected |

`npm run check` runs type checking, Vitest, story validation, the package build,
package validation, and the Storybook build. **It does not include Playwright**.
Browser tests require up-to-date `dist/` and `storybook-static/` outputs;
`npm run check` generates both. They use locally installed Chrome and Chromium in
CI. Development Storybook uses port 6006; Playwright's configuration serves the
static catalog on port 6007.

Add tests when changing behavior or fixing a meaningful regression. Prioritize
observable actions, roles, and accessible names with Testing Library and
`userEvent`. Verify computed styles, theme inheritance, portals, and CSS isolation
in a browser; jsdom does not replace those checks. Do not weaken assertions or
disable axe to make a change pass. Documentation-only changes do not require the
full suite.

### Test value and scope

- Add a test only when it protects a critical user path, a public contract, or a
  meaningful regression. Identify the failure it would catch before writing it.
- Prioritize keyboard and focus behavior, loading and validation, native form
  semantics, accessibility, portal theme inheritance, CSS isolation, and actual
  package/Tailwind consumer integration.
- Do not test documentation headings, page counts, sidebar organization, copy,
  token inventories, or other incidental presentation. Review documentation and
  build examples instead. Avoid assertions that merely repeat implementation
  strings or constants without exercising observable behavior.
- Cover each contract at the lowest useful level. Do not repeat the same check
  in unit tests, catalog tests, and package tests unless each catches a distinct
  failure. Use browser tests for behavior that depends on real CSS or focus.
- Parameterize only meaningful compatibility boundaries, such as published CSS
  versus consumer-generated CSS, layered imports, or light/dark theme behavior.
  Avoid repeating equivalent cases or rerunning accessibility scans already
  covered by the component sweep without a distinct state or theme to check.
- Remove or merge obsolete and redundant tests in the area being changed.
  Preserve meaningful assertions and regression coverage; fewer tests is not
  the objective by itself. Do not add tests merely because a file changed.

## Upstream and versioning

- Preserve attribution, `THIRD_PARTY_NOTICES.md`, and the shadcn license.
- `node scripts/fetch-shadcn.mjs` updates snapshots and the manifest, not local
  components. Use it for a requested upstream update and compare changes before
  adapting them; do not overwrite customizations with the CLI without reviewing
  the diff.
- For publishable changes, prepare a Changeset with clear scope and impact: patch
  for fixes and minor for compatible new features. Under the current policy,
  breaking changes require explicit migration notes and a major bump.
- Publishing requires an explicit request. `npm run release` publishes to npm;
  do not run it as a validation step. Run `version-packages` when preparing a
  requested release, not as part of routine editing.
