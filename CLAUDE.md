# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A **template repository**, not a site. Client projects are seeded from it, so changes
here propagate to every future project. Prefer conservative, well-understood changes
over clever ones, and keep the dummy content/components working as reference examples.

Stack: **Hugo** (static site) → **Netlify** (build/host) → **Decap CMS** (`/admin/`, via
Netlify Identity + git-gateway).

`.github/copilot-instructions.md` holds the long-form conventions guide (BEM rules, grid
usage, shortcode/partial recipes, front matter shapes, i18n). Read it before writing
templates or SCSS. This file covers what that guide does not: the build pipeline's
non-obvious wiring and the traps in it.

## Commands

```bash
npm run dev     # hugo server → http://localhost:1313
npm run build   # hugo → public/
npm run lint    # eslint + stylelint (same gate Netlify runs)
```

There is no test suite. **`npm run lint` plus a clean `hugo` build is the full
verification story** — run both before claiming a change works. A production build
should emit *zero* warnings; treat a new Hugo deprecation warning as a failure.

To reproduce the Netlify build exactly:

```bash
npm ci && npm run lint && CONTEXT=production URL=https://example.com/ ./bin/build.sh
```

## Build pipeline (the non-obvious parts)

**npm does not build anything.** Hugo owns the asset pipeline; npm only supplies the
binaries, linters and source files that Hugo pulls in.

- SCSS is compiled by Hugo in `layouts/partials/base/styles.html`, not by a bundler.
  That partial runs `resources.ExecuteAsTemplate` on the entry file, so
  **`assets/styles/style.scss` is a Hugo template** — but only that file. Partials it
  `@use`s are read straight off disk by Sass and never see the template engine, so
  `{{ }}` works in `style.scss` and nowhere else.
- **Sass is Dart Sass** (`transpiler: "dartsass"`). Use the module system — `@use` with
  `sass:math` / `sass:map` / `sass:meta`, not `@import`, `map-get` or `/` division. Each
  partial must `@use` what it needs; `style.scss` loading something does not put it in
  scope elsewhere.
- **Dart Sass is NOT bundled with Hugo.** Hugo extended ships LibSass only; the `dartsass`
  transpiler shells out to a Dart Sass binary on `PATH`. That binary comes from the
  `sass-embedded` devDependency, and `bin/with-dart-sass.sh` puts it on `PATH` — every
  entry point (`npm run dev`, `npm run build`, `bin/build.sh`) goes through that wrapper.
  Never call `hugo` bare in a script or CI step: without the wrapper the build dies with
  `TOCSS-DART: ... You need to install Dart Sass` and **exit code 2**. Note npm links only
  the pure-JS `sass` into `node_modules/.bin`, which cannot speak `--embedded`; the usable
  native binary lives in `node_modules/sass-embedded-<platform>/dart-sass/`.
- A machine with its own Dart Sass (e.g. `brew install sass`) will build fine even if the
  wrapper is bypassed. **That hides the breakage** — verify pipeline changes with a PATH
  that excludes it, or trust only the Netlify preview.
- **Breakpoints live in `hugo.toml` only.** `[params.breakpoints]` is sorted by
  `layouts/partials/base/breakpoints.html` and passed into `grid/_breakpoints.scss` via
  `@use ... with`. Never hardcode a breakpoint in Sass — `_breakpoints.scss` `@error`s if
  it receives an empty map. The sort is load-bearing: Hugo iterates maps alphabetically,
  which would emit min-width queries out of cascade order.
- `postcss-cli` is a **required runtime dependency of the build**, even though nothing
  in `package.json` invokes it. Hugo's `| postCSS` pipe shells out to
  `node_modules/.bin/postcss`. Removing it as "unused" breaks the build.
- PurgeCSS runs on **every** build, including `hugo server`. It scans `layouts/`,
  `assets/scripts/`, `content/` and `data/`. Markdown and JSON go through a **custom
  extractor** (`postcss.config.js`) that reads only `class="..."` and `extraClass="..."`
  attributes — the default extractor treats every prose word as a class name, which
  would keep almost everything. So a class an editor types into a CMS field is kept, but
  one built dynamically in JS is not: put those in the PurgeCSS `safelist`.
- Sourcemaps are emitted for `hugo server` only. Fingerprinting, minification,
  `PostProcess` and JS minification only run under `hugo.IsProduction`.

## Version pinning

`netlify.toml` `[build.environment]` pins **Hugo** and nothing else — verify a bump with
a local build at that exact version before changing it, since Hugo governs the actual
site output.

Node is deliberately **not** pinned. Netlify's build image supplies it, and the toolchain
needs Node >= 22.13 (eslint 10, postcss-cli 12). Current build images default to 24, but
Netlify pins a site to its image's default at creation time, so a long-lived site can sit
on an older Node than a fresh one. If a Netlify build fails on an engine/syntax error that
does not reproduce locally, check the Node version in the deploy log first.

## Deployment

`bin/build.sh` branches on `CONTEXT`: production builds with `--minify -b $URL`, previews
with `-b $DEPLOY_PRIME_URL` (and `noindex`, via the `CONTEXT` check in `baseof.html`).
Both `sed` the current branch into `static/admin/config.yml`'s `__BRANCH__` placeholder,
so **never commit a resolved branch name there**.

Only `HUGO_*` and `CONTEXT` env vars are readable from templates —
`[security.funcs] getenv` in `hugo.toml` gates the rest.

## Conventions

- **JS**: vanilla, ESM, JavaScript Standard Style (no semicolons, single quotes, space
  before function parens) enforced by `@eslint/js` + `@stylistic` — `eslint.config.js`
  reproduces Standard via `stylistic.configs.customize()` rather than pulling in a
  preset. No framework, no TypeScript. `assets/scripts/` is concatenated and bundled by
  `layouts/partials/base/scripts.html`; add new files to the slice there.
- **SCSS**: BEM. Register new partials with `@use` in `assets/styles/style.scss`; load
  order is cascade order (normalize → grid → utilities → components).
- **Strings**: user-facing text goes in `i18n/en.toml` and is read with `{{ T "key" }}`,
  including in inline scripts. No hardcoded copy in templates.
- **HTML**: not linted. htmlhint was removed — with the rules Hugo syntax forced off,
  only `alt-require` and `id-unique` still fired, and neither is meaningful across
  partials that compose into a page. Add it back per project if it earns its place.

## Gotchas worth knowing

- Decap CMS and Netlify Identity load from CDNs at unpinned versions
  (`decap-cms@^3.0.0` from unpkg) in `static/admin/index.html`. Dependabot cannot see
  them, and that page holds git write access via git-gateway. A `/admin/` breakage with
  no matching commit is almost always an upstream release, not this repo.
- `layouts/partials/base/unsupported-browser.html` carries an **ES5 inline script** — it
  runs on the browsers it is warning about, so no `const`, arrow functions or template
  literals. ESLint does not lint inline scripts; it will not catch a slip here.
- `static/admin/config.yml` still exposes a `googleAnalytics` field at the top level.
  Modern Hugo reads `services.googleAnalytics.ID`, so that field writes a key nothing
  consumes.

## Housekeeping

Do not commit `public/`, `resources/`, or `.hugo_build.lock` (all gitignored). Do not
commit unless explicitly asked.
