## 1.2.0 (2026-02-06)

### Features

#### Add font parameter to choose math font (modern default, 9 others available)

- Upgrade to MathJax v4.0.0-beta.7
- Default font changed from 'tex' to 'modern' (Latin Modern)
- Fonts are downloaded automatically on first use via pacote
- Cached in ~/.cache/math-svg-mcp/fonts/

Available fonts: modern (bundled), stix2, newcm, fira, bonum, pagella, schola, termes, dejavu, asana

## 1.1.2 (2026-02-04)

### Fixes

- Add mcpName field for official MCP registry support

## 1.1.1 (2026-02-04)

### Fixes

- Improve README for MCP server users with configuration examples and Sidekick banner

## 1.1.0 (2026-02-01)

### Features

#### Add depth output for baseline alignment

Returns the distance below the text baseline, extracted from MathJax's vertical-align style. This enables proper vertical alignment when placing formulas inline with text.

#### Add required unit parameter and optional xHeightRatio for precise SVG sizing

- Add required `unit` parameter (`pt`, `px`, `mm`, `ex`) to control output dimensions
- Add optional `xHeightRatio` parameter for font-specific x-height tuning
- fontSize is now specified in the same unit as the output for intuitive sizing
- Improves compatibility with print applications like InDesign

## 1.0.4 (2026-02-01)

### Fixes

- Remove mjx-container HTML wrapper from SVG output, producing valid standalone SVG files that work with applications like Adobe InDesign

## 1.0.3 (2026-02-01)

### Fixes

- Fix mcpb manifest - add required repository type field

## 1.0.2 (2026-02-01)

### Fixes

- Fix mcpb manifest validation errors

## 1.0.1 (2026-02-01)

### Fixes

- Add CI workflow and project configuration
