---
math-svg-mcp: minor
---

Add required unit parameter and optional xHeightRatio for precise SVG sizing

- Add required `unit` parameter (`pt`, `px`, `mm`, `ex`) to control output dimensions
- Add optional `xHeightRatio` parameter for font-specific x-height tuning
- fontSize is now specified in the same unit as the output for intuitive sizing
- Improves compatibility with print applications like InDesign
