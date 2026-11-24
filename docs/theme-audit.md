# Theme and contrast audit

Run this audit when changing palettes, semantic role assignments, component
states, CSS imports, or portal theming. It covers Base, Comal, Cobalto, Matrix,
La Viuda, and Workbench in light and dark schemes. Add future themes to the
contrast matrix and the existing portal/recipe checks when introducing them.

## Repeat the audit

Use Node 24 (`nvm use`), install dependencies with `npm ci`, and install Google
Chrome locally. CI uses Playwright Chromium (`npx playwright install --with-deps
chromium`). From the repository root, run:

```bash
npm run audit:themes
```

This runs `npm run check` before the full Playwright suite. Package validation,
compiled package CSS, and the static Storybook catalog therefore use current
sources. Do not rebuild while browser tests are running: the build replaces the
assets under test. No publishing or versioning command is involved.

The command saves:

- `playwright-report/index.html`: browsable test results and attachments. Open
  with `npx playwright show-report`.
- `test-results/theme-audit.json`: machine-readable Playwright results. Each
  contrast test attaches `contrast-measurements`, containing the theme, scheme,
  CSS consumer, surface/control label, default/hover state, actual contrast ratio,
  and required minimum. Reports include passing measurements and failures.

Both directories are generated artifacts and must remain uncommitted. Archive
reports outside the source tree when retaining evidence for a release.

For a contrast-only iteration after successful, current builds:

```bash
GREDA_THEME_AUDIT=1 npm run test:browser -- tests/theme-contrast.spec.ts
```

Use `--grep 'theme contrast: comal'` to narrow that command to a theme. Run the
complete audit again after source changes that affect other contracts.

## Automated coverage

The contrast matrix has 24 cases: six themes × two schemes × two CSS consumers
(published package CSS and Tailwind 4 with component styles in a components
layer). It checks real computed styles and composites translucent fills over
their ancestors. Canvas resolves browser CSS colors, including the modern color
formats emitted by Tailwind 4; an RGB-only string parser cannot measure those
reliably. Assertions use unrounded ratios. A ghost Button also checks that its hover fill
differs from the surrounding tertiary panel or secondary-control surface. This
prevents complete feedback collisions; it does not quantify perceived separation.

| Contract | Threshold and coverage |
| --- | --- |
| Normal text | At least 4.5:1 for primary, secondary, muted, action, and destructive text on primary, secondary, raised, tertiary, accent, and secondary-control surfaces |
| Inverse text | At least 4.5:1 on the inverse surface |
| Field boundaries | At least 3:1 for Input and Textarea borders on those six surfaces |
| Component states | At least 4.5:1 for default, destructive, and secondary Button and Badge labels in default and hover states on those six surfaces |

These thresholds implement WCAG AA [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
and [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast).
Transitions are disabled only in the contrast fixtures to measure settled states.
The full browser suite separately checks reduced motion and interaction behavior.

The existing browser suite also covers axe scans of component examples, all-theme
dialogs and portals, scoped native color schemes, recipe keyboard focus and
mobile layout, CSS isolation, consumer overrides, and Tailwind 4 integration.
The component example sweep uses the default theme; the all-theme contrast matrix
and theme-specific dialog/recipe tests provide complementary coverage.

## Manual review

In Storybook, select each theme and both schemes. Review the Tokens palette and
role previews plus the corresponding recipe and interactive components:

1. Confirm brand identity, readable supporting surfaces, and the light neutral
   scale's progression. Dark palettes explicitly reassign neutral steps to text
   and border roles; their step numbers are not a dark tonal ramp.
2. Review visual hierarchy separately from text contrast. Compare a tertiary
   panel, a secondary control, and a hover/focus fill in context. The Tokens
   role preview includes real controls on the tertiary surface. Hover the context
   action to compare its fill, then Tab to inspect its focus indicator. The
   interaction fill should be perceptible without competing with the primary
   action. Compare secondary controls and interaction fills side by
   side too. Related hues are appropriate; identical or nearly identical fills
   can flatten the hierarchy. Record this visual judgment separately from WCAG
   contrast results; there is no additional WCAG ratio asserted for these roles.
3. Inspect buttons and badges at rest and on hover. Check error text, placeholder
   text, checked/indeterminate indicators, and selected/disabled states. Inactive
   controls have contrast exemptions; enabled controls do not.
4. Tab through fields, buttons, selects, dialogs, and popovers. Check visible
   focus, focus restoration, Escape handling, and portal colors inside a scoped
   theme. The color matrix measures text and field borders, not focus geometry
   or every icon.
5. Check narrow viewports, zoom, text resizing, and reduced motion. Verify that
   errors and state changes remain understandable without color alone.
6. Review semantic token assignments, dark overrides, CSS import order, and
   documentation. Preserve low-specificity selectors and theme/scheme attributes
   on the same boundary. Custom consumer token overrides need their own review.

Record findings with theme, scheme, component/state, actual foreground and
background, contrast ratio, expected threshold, source location, and fix. Add
regressions at the lowest useful level. Passing this audit supplies bounded
contrast and interaction evidence; full WCAG conformance also requires reviewing
the consuming application's content and complete user journeys.

## Recorded audit: 2026-11-15

The initial expanded matrix found failures in 14 of 20 cases (the two CSS
consumers agreed). Comal already included the preceding palette corrections.
Minimum failing ratios below are rounded for display only.

| Theme | Findings before these corrections | Changes |
| --- | --- | --- |
| Base | Light field boundaries 1.18:1; muted text 4.25:1. Dark field boundaries 1.41:1; action text 3.97:1; error text 3.90:1. | Stronger borders, darker light muted text, brighter dark actions/errors. |
| Comal | Expanded matrix passed. Earlier audit found light field boundaries 1.97:1, Badge hover labels 3.34–3.38:1, destructive Button hover labels 3.97:1, and dark tertiary supporting text 3.14:1. | Stronger borders, deeper light actions/errors, darker dark olive surfaces, brighter supporting text, and stable noninteractive Badge backgrounds. |
| Cobalto | Light field boundaries 1.13:1; error text 4.46:1. Dark matrix passed. | Stronger light borders and darker light errors. |
| Matrix | Light field boundaries 1.37:1; dark field boundaries 2.52:1. | Stronger field boundaries in both schemes. |
| La Viuda | Light field boundaries 1.13:1; muted text 3.84:1; action text 4.17:1. Dark supporting text 3.82:1; action text 4.02:1; field boundaries 2.34:1. | Stronger borders, darker light supporting/action text, brighter dark supporting/action text. |

After the palette corrections, all 20 contrast cases passed, covering 2,300
measurements. Minimum measured ratios across both schemes, both consumers,
all sampled surfaces, and default/hover states were:

| Theme | Normal text minimum | Field-border minimum |
| --- | --- | --- |
| Base | 4.63:1 | 3.22:1 |
| Comal | 4.63:1 | 3.26:1 |
| Cobalto | 4.64:1 | 3.24:1 |
| Matrix | 4.54:1 | 3.22:1 |
| La Viuda | 4.65:1 | 3.20:1 |

Light neutral steps were reordered where stronger borders would otherwise invert
`gray-200` and `gray-300`. Explicit dark overrides preserve the intended readable
supporting text. Theme names, token names, CSS subpaths, and component APIs remain
compatible. Noninteractive Badge backgrounds now stay stable on hover across all
themes; buttons retain hover feedback.

Visual review also found that the Matrix recipe forced dark mode even when light
was requested. The recipe now follows the selected scheme, and recipe browser
checks assert the effective color scheme before evaluating layout and focus.


## Visual hierarchy refinement

The first contrast audit preserved readable labels but missed role collisions:
Comal used the same fill for tertiary panels and context highlights; Cobalto
used the same fill for secondary controls and context highlights. A ghost
Button could therefore lose its hover fill on those surrounding surfaces.
The added browser check reproduces both collisions in light and dark modes.

Comal now reserves sage/olive for tertiary panels, uses warm neutral secondary
controls, and uses clay-tinted interaction fills. Cobalto keeps its blue identity
with stronger interaction fills than its soft secondary controls; supporting
text, errors, and borders were adjusted to retain contrast on that stronger fill.
Base, Matrix, and La Viuda retain their existing distinct tonal steps.

The current matrix includes ghost Button labels and hover states as well as
its earlier checks: 20 cases and 2,540 contrast measurements. The preceding
recorded minimums describe the earlier audit snapshot. Visual review remains
necessary to judge emphasis and subtle differences that a color inequality
assertion cannot establish.
