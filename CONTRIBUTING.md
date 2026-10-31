# Contributing to Greda

## Development

Use **Node 24**, as specified in `.nvmrc`, and npm with the committed lockfile.

```bash
nvm use
npm ci
npm run storybook
```

Storybook runs at **http://localhost:6006** with component examples, automatic
prop documentation, an axe panel, and Base/Comal/Cobalto and light/dark toolbar options.

### Validation

```bash
npm run check
npm run test:browser
```

`check` runs type checking, Vitest, story validation, the package build, package
validation, and the static Storybook build. **Playwright runs separately** through
`test:browser` and requires up-to-date `dist/` and `storybook-static/` outputs;
run `check` first.

Browser tests serve the static catalog on port **6007** and cover component
accessibility, critical interactions, themes, portals, and package CSS integration.
Tests should protect public contracts and meaningful regressions; documentation
structure and repeated implementation assertions do not need tests. See the
test-value rules in [AGENTS.md](AGENTS.md). For test-only changes, reuse current
build outputs if their source inputs have not changed. Local runs use installed
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
Pass component names, for example `node scripts/fetch-shadcn.mjs popover`, to
refresh only those snapshots. Selective updates record retrieval dates on their
manifest entries and preserve the other snapshots and their retrieval dates.

### Versioning and publishing

Add a Changeset with `npm run changeset` for publishable changes. Use patch
versions for fixes and minor versions for compatible features. Breaking prop,
token, or export changes require explicit migration notes and a major bump.

Releases use the manually triggered [Release workflow](.github/workflows/release.yml).
In GitHub, open **Actions → Release → Run workflow**, select `main`, and run it.
The workflow applies pending Changesets, validates the package and Storybook,
runs browser tests, commits version/changelog changes to `main`, publishes to npm,
and pushes the tags created by Changesets. The workflow requires permission to push release commits
to `main`; repositories with branch rules must allow that before using this flow.

Select **dry_run** to validate and preview the package without committing, pushing,
or publishing. The workflow runs only on `main`; ordinary pushes and pull requests
do not publish. Releases are serialized so two runs cannot publish concurrently.
If publishing fails after the version commit, fix the cause and run it again on
`main`: Changesets publishes the existing unpublished version when no new Changesets
are pending, and skips versions already present on npm.

Configure [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) once
in the npm package's **Settings → Trusted publishing** section. Select GitHub Actions:

| Field | Value |
| --- | --- |
| Organization or user | `DarthCharles` |
| Repository | `greda` |
| Workflow filename | `release.yml` |
| Environment name | Leave empty; this workflow does not select a GitHub environment |
| Allowed actions | Enable **Allow npm publish** for direct publishing |

New trusted publishers allow staged publishing by default. Without **Allow npm
publish**, this workflow's direct publish fails with `OIDC permission denied for
this action`. The configuration is validated by its first successful publish;
complete that publish within npm's displayed validation deadline.

The workflow must be present on GitHub before configuring it in npm. npm requires
Node 22.14+ and npm CLI 11.5.1+; the workflow uses the current Node 24 release from
`.nvmrc`. GitHub grants a short-lived OIDC identity through `id-token: write`, so
no npm token secret or interactive npm login is needed for releases. Package
repository metadata points at this GitHub repository for trusted publishing.

For a local release instead, `npm run version-packages` prepares versions and
changelogs, and `npm run release` validates and publishes through Changesets using
your npm credentials. Publishing requires an explicit release action.

