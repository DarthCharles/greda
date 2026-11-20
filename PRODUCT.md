# Greda

<!-- impeccable:product-schema 1 -->

## Platform

web

## Library Purpose

Greda (`@darthcharles/greda`) is a reusable React and TypeScript design system
library. This repository develops components, tokens, optional themes, and their
documentation. It is not a product landing page or a standalone application.

## Users

React developers consume the library in their applications. Library maintainers
develop and validate its public API, styling, behavior, and documentation.
More specific audience segments and application domains are not established.

## Operating Context

Consumers install the npm package, import compiled CSS, and compose components
through the public exports. Tailwind configuration is not required. Applications
own page layout, font loading, and application content.

Storybook is the component documentation and demonstration catalog. Theme recipes
show fictional compositions to explain library usage; they do not define Greda
as a shop, workshop, terminal application, or other example business.

## Capabilities and Constraints

- Preserve React 18 and 19 compatibility, ESM exports, TypeScript declarations,
  and compiled CSS.
- Follow the existing shadcn/ui New York and Radix composition model, retaining
  native semantics, props, refs, keyboard interaction, and focus behavior.
- Support consumer customization through semantic CSS tokens and optional themes.
  Keep the neutral base separate from brand themes and light/dark schemes.
- Treat public props, exports, variants, tokens, and their formats as compatibility
  contracts. Document migrations for breaking changes.
- Keep component styles scoped and overridable, preserve portal theme inheritance,
  and avoid resetting unrelated consumer markup.
- Use README.md and AGENTS.md for usage, implementation rules, and validation
  requirements. This record does not replace those documents.

## Evidence on Hand

- `README.md`: installation, public usage, integration, and theming guidance.
- `src/components/ui/` and `src/index.ts`: components and public exports.
- `src/styles/tokens.css`: token source of truth.
- `src/styles/themes/`: optional Comal, Cobalto, Matrix, and La Viuda themes.
- `src/stories/`: component examples, usage guides, token catalog, and recipes.
- `src/components/behavior.test.tsx` and `tests/`: behavior, browser,
  accessibility, and consumer integration coverage.

## Principles for Future Design Work

- Evaluate reusable components and their composition across consuming applications.
- Preserve consumer control over identity, layout, and content.
- Review library changes across supported themes, schemes, states, and integration
  boundaries rather than optimizing only one demonstration page.
- Keep examples accurate and accessible, with documentation grounded in the public API.
- Scope Impeccable reviews to components, tokens, themes, or catalog usability.
  Marketing conversion goals and landing-page workflows are not established
  requirements for this library.

## Accessibility & Inclusion

Preserve semantic markup, accessible control names, visible focus, keyboard
operation, dialog focus management, readable contrast, reduced-motion support,
and responsive overlay constraints. Validate behavior at the appropriate unit or
browser level as required by AGENTS.md. No additional compliance certification
or product-specific accessibility standard has been established.
