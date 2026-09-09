[![Netlify Status](https://api.netlify.com/api/v1/badges/258a10dd-ef97-4e72-80ed-9d7efc84d8a8/deploy-status)](https://app.netlify.com/sites/hugo-template/deploys)

# hugo-template

Template repository for Jamstack projects.

- Client:
- Netlify URL: https://hugo-template.netlify.app/
- Production URL:

## Installing

You need Hugo installed on your machine: <https://gohugo.io/getting-started/quick-start/>

This repository is set up to be developed with [Visual Studio Code](https://code.visualstudio.com/) editor. Please install reccommended extensions listed in [extensions.json](.vscode/extensions.json)

If this is your first time running the project, run

`npx husky init`

When you have that run one of these commands for local dev server:

`hugo server` or `npm run dev`

and open your local site on http://localhost:1313/

## Development

We use [BEM](http://getbem.com/) naming convention for CSS class names.

We follow the standard Javascript style.

### Linters

There are 2 linters set up:

- [stylelint](https://stylelint.io/) for CSS/SCSS
- [eslint](https://eslint.org/) for JavaScript

Hugo templates are not linted. htmlhint was removed because the rules that survive Hugo's
`{{ }}` syntax caught almost nothing; add it back per project if you want it.

#### Linter Configuration Files

- `stylelint.config.js` - Stylelint configuration using ES modules
- `eslint.config.js` - ESLint configuration using ES modules

#### Running Linters

```bash
# Run all linters
npm run lint

# Run individual linters
npx stylelint "**/*.scss"
npx eslint .
```

#### Auto-fixing

Linters will automatically fix issues when possible:

- **VS Code**: Auto-fixes on save (if recommended extensions are installed)
- **Command line**: Use `--fix` flag with eslint and stylelint
- **Pre-commit hook**: Automatically runs lint-staged which fixes staged files

#### Pre-commit Hook

A pre-commit git hook is configured using [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged). It:

- Runs linters only on staged files for better performance
- Auto-fixes issues when possible
- Prevents commits if there are unfixable errors

The hook configuration is in `.husky/pre-commit` and runs `npx lint-staged`, which uses the `lint-staged` configuration in `package.json`.

## Deployment

To deploy to production, push to `main` branch

### Development URL

There is no development URL out of the box. To create this environment, follow these steps:

1. create branch `develop`
2. Go to Netlify dashboard -> your site -> Settings -> Build & deploy -> Deploy contexts -> Edit settings
3. Under Branch deploys select Let me add individual branches and add `develop`
4. push some code to `develop` branch and see it on <https://develop--hugo-template.netlify.app>

## Additional setup

These configurations are optional based on the demands of your project.

### Configure Github Actions

See [How to Configure Github Actions on a Site](https://github.com/poslovnimediji/knowledgebase/wiki/How-to-Configure-Github-Actions-on-a-Site).

### Configure Decap CMS + Netlify Identity

See [How to enable Netlify Identity for Decap CMS on a site](https://github.com/poslovnimediji/knowledgebase/wiki/How-to-enable-Netlify-Identity-for-Decap-CMS-on-a-site).

### Netlify Large Media

Netlify large media is (deprecated)[https://answers.netlify.com/t/large-media-feature-deprecated-but-not-removed/100804]

Don't use it with new projects anymore. Preferably use cloudinary instead

### Hugo shims dependencies

See [How to use Hugo shims dependencies](https://github.com/poslovnimediji/knowledgebase/wiki/Hugo-shims-dependencies).

## Built With

- [Hugo](https://gohugo.io/)
- [Decap CMS](https://decapcms.org/)
- [Netlify](https://www.netlify.com)

## Dependencies

**Last updated:** September 2026 — all dependencies are on their latest versions and
`npm audit` reports 0 vulnerabilities.

npm carries **no runtime dependencies**. Hugo owns the asset pipeline; the `devDependencies`
supply the binaries it shells out to, the linters, and `modern-normalize` (loaded from
`node_modules` by `assets/styles/style.scss` rather than vendored, so it stays updatable).

[Dependabot](.github/dependabot.yml) groups routine dev-dependency bumps into one weekly
PR and security fixes into another, so advisories in transitive packages don't arrive as
a burst of near-identical lockfile PRs.

Key development dependencies:

- ESLint 10 with `@eslint/js` + `@stylistic/eslint-plugin` (JavaScript Standard Style)
- Stylelint 17 with `stylelint-config-standard-scss` 17
- modern-normalize 3 (CSS reset, compiled in via Dart Sass)
- Husky 9 for Git hooks, lint-staged 17 for pre-commit linting
- PostCSS 8 with PurgeCSS 8 and Autoprefixer — `postcss-cli` is **required**: Hugo's
  `| postCSS` pipe shells out to `node_modules/.bin/postcss`
- `sass-embedded` — the Dart Sass binary Hugo's `dartsass` transpiler needs. Hugo does
  **not** bundle Dart Sass (extended ships LibSass only), so `bin/with-dart-sass.sh` puts
  it on `PATH` and every build entry point goes through that wrapper

The project uses ES modules (`"type": "module"`) for its configuration files.
