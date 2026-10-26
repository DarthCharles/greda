# Contributing to Greda

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

