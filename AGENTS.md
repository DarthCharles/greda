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
| `src/lib/utils.ts` | `cn`: conditional classes and `ds-` conflict resolution |
| `src/styles/tokens.css` | Source of truth for tokens and base palettes |
| `src/styles/styles.css` | Scoped baseline, utilities, and reduced motion |
| `tailwind.config.ts` | Mapping tokens to compiled utilities |
| `src/stories/` | Examples, documentation, and token catalog |
| `.storybook/` | Configuration, catalog styles, and example Comal theme |
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

- Use utilities with the `ds-` prefix, including modifiers such as
  `hover:ds-bg-primary`. Keep class names complete and static so Tailwind can
  detect them; avoid building utility names through interpolation.
- The package build scans `src/components/ui/`. Catalog-only styles belong in
  Storybook CSS; a class used only in a story is not guaranteed to appear in the
  published CSS.
- Keep `.comal-ui` on elements that need the baseline, including overlays, portaled
  content, and public variant helpers.
- Preserve `preflight: false` and the scoping of `--tw-*` initializers in
  `scripts/scope-tailwind-defaults.cjs`, shared by the package and Storybook.
  Importing the CSS must not alter elements outside the library.
- Use semantic tokens for colors, typography, spacing, and states. Prefer extending
  an existing token over introducing repeated fixed visual values.
- Define colors as space-separated HSL channels without an `hsl()` wrapper;
  `--overlay` includes alpha. Other tokens accept CSS values.
- Preserve low specificity with `:where()` so consumer overrides work regardless
  of stylesheet import order.
- Keep brand themes separate from `data-color-scheme="dark"`. The base theme is
  neutral; Comal branding and fonts belong in the Storybook example or the
  consuming application. Do not add font downloads to the package.
- When changing tokens, review the dark palette, Tailwind mapping, and token
  classification/previews in `src/stories/tokens/`. Run `npm run docs:tokens` to
  regenerate the README table; do not maintain it manually.
- Preserve viewport constraints on overlays, visible focus, and support for
  `prefers-reduced-motion`.

## Accessibility and documentation

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

## Validation appropriate to the change

| Change | Validation |
| --- | --- |
| Documentation only | Review paths, commands, links, and examples for accuracy |
| Components, types, or behavior | `npm run typecheck`, `npm test`, `npm run validate:stories` |
| Tokens | `npm run docs:tokens` and review the generated diff; validate as a visual change |
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

## Upstream and versioning

- Preserve attribution, `THIRD_PARTY_NOTICES.md`, and the shadcn license.
- `node scripts/fetch-shadcn.mjs` updates snapshots and the manifest, not local
  components. Use it for a requested upstream update and compare changes before
  adapting them; do not overwrite customizations with the CLI without reviewing
  the diff.
- For publishable changes, prepare a Changeset with clear scope and impact: patch
  for fixes and minor for compatible new features. Under the current policy,
  breaking changes require explicit notes and a minor bump before 1.0; after 1.0,
  they require a major bump.
- Publishing requires an explicit request. `npm run release` publishes to npm;
  do not run it as a validation step. Run `version-packages` when preparing a
  requested release, not as part of routine editing.
