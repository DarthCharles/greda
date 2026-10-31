# Third-party notices

The components in `src/components/ui/` are adapted from shadcn/ui's official
New York registry, distributed under the MIT license.

- Source: https://github.com/shadcn-ui/ui
- Registry: https://ui.shadcn.com/r/styles/new-york/{component}.json
- Original copyright and license: `upstream/shadcn-ui/LICENSE.md` (included in the package)
- Exact downloaded source, retrieval date, and hashes: `upstream/shadcn-ui/`

This project uses the React 18-compatible New York component sources and
Tailwind 3.4. Radix dependencies remain because they are used by those shadcn
components. The upstream Toast is maintained here as the explicit primitive API
requested for the initial component set.

Local adaptations: relative imports; shared semantic color utilities; a scoped CSS baseline;
consumer token mapping; optional portal containers; button loading, 1px press feedback from the current Nova style, and a default
non-submit type; viewport bounds on dialogs and popovers; popover root positioning options,
portal container refs, and an explicit close helper; invalid-field styles; an accessible
toast close name; and a distinct indeterminate checkbox icon.
