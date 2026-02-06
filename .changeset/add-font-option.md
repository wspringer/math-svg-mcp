---
math-svg-mcp: minor
---

Add font parameter to choose math font (tex default, 10 others available)

Fonts are automatically downloaded on first use via pacote (npm's package fetcher) and cached in ~/.cache/math-svg-mcp/fonts/. This works with npx and bun - no project context needed.

Available fonts: tex (bundled), stix2, newcm, fira, bonum, pagella, schola, termes, modern, dejavu, asana
