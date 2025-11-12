Optimized images folder

This folder is intended to store generated optimized assets (resized, webp conversions) for production.

Suggested tooling:
- Use `sharp` (Node) or an image pipeline in CI to generate multiple sizes and formats.
- Place generated files under `_optimized/<gallery>/` matching manifest paths.
- Do not commit large generated files to the repo; instead store them in an artifacts storage or commit only small sample files.
