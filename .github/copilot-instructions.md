# Copilot Instructions for hugo-template

## Instructions for initial setup

This project is a starter template. When setting up a new project based on this template, make sure to update the following:

- Project Name: Find all instances of `hugo-template` and replace them with your project's name.
- Update `hugo.toml` with your site's title, description, baseURL, language, and other settings.
- Update `README.md` with your project's specific information.
- Update site description in `package.json`, 
- Delete dummy content in the `content/` directory.
- Delete dummy shortcodes and partials that are not needed (financing-table).
- Setup multi-language support if needed.
- Setup Netlify Identity for Decap CMS if using the CMS. If not, delete CMS-related files.
- Update `static/admin/config.yml` with your repository details for Decap CMS.
- Delete this initial instructions chapter after setup to avoid confusion.

## Project Overview

This is a Hugo-based static site with Decap CMS integration, deployed via Netlify. The project emphasizes performance, a11y, usability, design, and code quality.

## Architecture Overview

**Core Stack:**
- **Hugo** - Static site generator for building the site
- **SCSS** - Custom grid system + component styling
- **JavaScript** - Minimal vanilla JS (no framework). Optional use of Vue.js or Alpine.js for interactivity
- **Netlify + Decap CMS** - Content management and deployment

**Key Directories:**
- `layouts/` - Hugo templates (baseof.html, partials, shortcodes)
- `assets/styles/` - SCSS with BEM naming convention + grid system
- `content/` - Markdown content
- `assets/scripts/` - Vanilla JavaScript utilities
- `static/` - Decap CMS config, fonts, email templates, etc., 
- `data/` - TOML/JSON data files (e.g., footer.json)

## Development Workflow

**Local Development:**
```bash
npm run dev  # Runs: hugo server (local dev at http://localhost:1313)
npm run build  # Runs: hugo (builds to public/)
npm run lint  # Runs all linters: htmlhint, eslint, stylelint
```

**Pre-commit Hook:**
The project uses Husky + lint-staged to auto-fix issues before commits. Linters run automatically on staged files. No manual setup needed after initial `npx husky init`.

**Deployment:**
- Push to `main` → Production build via Netlify
- Create `develop` branch → Preview build at develop--hugo-template.netlify.app (manual Netlify config needed)
- Build script: [bin/build.sh](bin/build.sh) handles environment-specific builds (production vs preview)

## Code Conventions

### Styling (SCSS)

**BEM Naming Convention:**
Use Block-Element-Modifier for all CSS classes. Example:
```scss
.button { /* block */ }
.button__text { /* element */ }
.button--primary { /* modifier */ }
```

**SCSS Structure ([assets/styles/style.scss](assets/styles/style.scss)):**
- Import order matters: normalize → grid → utilities → components
- Component files: `_base.scss`, `_button.scss`, `_header.scss`, etc.
- **PM Grid System** ([assets/styles/grid/](assets/styles/grid/)):
  - Custom 12-column grid using CSS Grid
  - Responsive classes: `col-12 col-sm-6 col-lg-4`
  - Breakpoints defined in `hugo.toml`
  - Grid variables: `--container-padding`, `--content-width`, `--grid-row-gap`, `--grid-column-gap`
  - See [assets/styles/grid/README.md](assets/styles/grid/README.md) for offset/order utilities

**Linting:**
- **stylelint** ([stylelint.config.js](stylelint.config.js)): SCSS linting with standard-scss config, allows legacy color notation
- Auto-fixes on save (VS Code) or with `stylelint --fix *.scss`

### JavaScript
**Structure:**
- Vanilla JS modules in [assets/scripts/](assets/scripts/)
- Optional Vue.js or Alpine.js components for interactivity (not included by default)

**Linting:**
- **eslint** ([eslint.config.js](eslint.config.js)): Uses neostandard preset
- **htmlhint** for template linting
- Auto-fixes on save or with `eslint --fix` / `htmlhint --fix`

### HTML & Templates

**Hugo Template Patterns:**
- Base template: [layouts/_default/baseof.html](layouts/_default/baseof.html) - defines head meta tags, og:tags logic
- Partials: [layouts/partials/](layouts/partials/) for reusable components (header, footer, scripts, styles)
- Shortcodes: [layouts/shortcodes/](layouts/shortcodes/) for components in markdown (e.g., button.html)

**Dynamic Head Tags:**
baseof.html computes og:tags (title, description, image) with fallbacks:
1. Use `params.ogTags.*` if set in front matter
2. Fall back to `.Title`, `.Description`, `.Params.image`
3. Finally use site-wide defaults from `hugo.toml`

## Content Organization

**Multi-language Support:**
- single-language by default, but multi-language ready
- multi language support via Hugo and Decap i18n features
- If multilang, each language is in `content/{lang}/` folder
- Internationalization files: `i18n/{lang}.toml` for UI strings
- Use `{{ T "key" }}` in templates to pull localized strings

**Front Matter Patterns:**
```yaml
---
title: "Page Title"
description: "Meta description"
ogTags:
  title: "Custom OG title"
  description: "Custom OG description"
  image: "/media/custom-og.jpg"
---
```

**Decap CMS:**
- Admin interface at `/admin/` (served from [static/admin/config.yml](static/admin/config.yml))
- Editor components: [static/admin/editor-components/](static/admin/editor-components/) (button.js)
- Build script dynamically sets branch name in CMS config

## External Dependencies & Integrations

**Build-Time:**
- **PostCSS** ([postcss.config.js](postcss.config.js)): Autoprefixer, PurgeCSS

**CMS:**
- **Decap CMS** - Requires Netlify Identity setup (see README.md)
- Hosted at `/admin/` with custom editor components

**Security:**
- Environment variables: Only `HUGO_*` and `CONTEXT` exposed via `hugo.toml` security rules
- Build context detection: Production vs preview determined by `CONTEXT` env var

## Common Patterns & Examples

**Creating a New Component (partial or shortcode):**
1. Create SCSS file in [assets/styles/](assets/styles/) (e.g., `_card.scss`)
2. Follow BEM: `.card {}`, `.card__title {}`, `.card--featured {}`
3. Use grid system: `col-12 col-md-6 col-lg-4`
4. Import in [style.scss](assets/styles/style.scss)
5. Create partial in [layouts/partials/](layouts/partials/) (e.g., `card.html`)
6. Include partial in template: `{{ partial "card" . }}`

**Creating a New Shortcode:**
7. Create HTML file in [layouts/shortcodes/](layouts/shortcodes/) (e.g., `card.html`)
8. Access parameters: `{{ .Get "paramName" }}` for named or `{{ .Get 0 }}` for positional
9. Use `.Inner` for content between shortcode tags
10. Reuse the partial inside the shortcode to maintain consistency
11. Use in markdown: `{{< card paramName="value" >}}Inner content{{< /card >}}`

**Adding i18n Strings:**
1. Add key-value pair to [i18n/en.toml](i18n/en.toml)
2. Use in template: `{{ T "key" }}`

## File Structure Quick Reference

```
layouts/_default/
  baseof.html       ← Main HTML skeleton
  single.html       ← Single content page template
  list.html         ← List/archive page template
layouts/partials/
  header.html       ← Site header
  footer.html       ← Site footer
  {component}.html  ← Partial templates (e.g., button.html)
  base/
    styles.html     ← CSS link tags
    scripts.html    ← JS script tags
layouts/shortcodes/
  {component}.html  ← Shortcode templates (e.g., button.html)

assets/styles/
  style.scss        ← Main SCSS entry point
  _base.scss        ← Base element styles
  _{component}.scss ← Component styles (e.g., _button.scss, _header.scss)
  grid/
    _grid.scss      ← PM Grid system
    _breakpoints.scss

content/
  _index.md         ← Home page (default language)
  {slug}.md         ← Root level pages
  {slug}/           ← Sections
    _index.md       ← Section landing page
    {slug}.md       ← Sub-pages
```
