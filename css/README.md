CSS organization and conventions — Rising Flow

Purpose

This file documents the current CSS layout and provides lightweight guidance for future refactors. The site currently uses plain CSS files split by page and a central `style.css` for globals.

Current structure

- css/
  - `style.css`        — global variables, layout, header/nav/footer, and shared components
  - `events.css`       — page-specific styles for events pages
  - `contact.css`      — page-specific styles for contact page
  - `pixel_block.css`  — page-specific styles for Pixel Block page
  - `song_search.css`  — page-specific styles for song search

Why this layout is fine

- Separation: page-level styles are isolated, making edits local and low-risk.
- Global theming: `style.css` holds color variables, layout rules, and shared components (carousel, header, footer).
- No build required: keeps the static site simple and easy to deploy.

When to consider a reorganization

- If files grow large or you want component reuse across pages, consider:
  - Splitting by component (e.g., `components/_header.css`, `_carousel.css`) and importing via a build step (postcss or scss).
  - Moving to a preprocessor (SCSS) for variables, nesting and partials if you plan many shared styles.
  - Converting to CSS modules or utility-first (Tailwind) if you need stricter scoping and smaller bundles.

Quick conventions for contributors

- Keep global tokens in `:root` inside `style.css` (colors, spacing scale, typography).
- Put page-only rules in the page file using a clear top-level selector (e.g., `.pixel-block-page .gallery-grid { ... }`).
- Avoid duplicating variable definitions in page files — reuse `:root` tokens.
- Use `data-` attributes for JS hooks rather than styling dependencies (easier refactor later).

Small checklist for future refactors

- Add `css/README.md` (this file) — done.
- If moving to SCSS, create a `styles/` source tree and a small npm script to compile to `css/` for deployment.
- Add a linter (stylelint) and a small CI check for basic rules.

If you want, I can:
- Split `style.css` into `css/components/` partials and wire a tiny build step, or
- Add a `stylelint` config and a test task to the repo.

