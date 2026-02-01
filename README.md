# math-svg-mcp

An MCP (Model Context Protocol) server that converts LaTeX math expressions to SVG using MathJax.

## Installation

```bash
npm install
npm run build
```

## Usage

### As an MCP Server

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "math-svg": {
      "command": "node",
      "args": ["/path/to/math-svg-mcp/dist/index.js"]
    }
  }
}
```

### Available Tools

#### `latex_to_svg`

Converts a LaTeX math expression to SVG and returns the SVG content directly. Best for small expressions.

**Parameters:**
- `latex` (required): The LaTeX math expression to convert
- `display` (optional): Display mode (block) vs inline mode. Default: `true`
- `fontSize` (optional): Font size in pixels. Default: `16`

**Example:**
```json
{
  "latex": "E = mc^2"
}
```

#### `latex_to_svg_file`

Converts a LaTeX math expression to SVG and saves it to a file. Best for larger expressions or when you need to reference the SVG by path.

**Parameters:**
- `latex` (required): The LaTeX math expression to convert
- `outputPath` (required): The file path where the SVG should be saved
- `display` (optional): Display mode (block) vs inline mode. Default: `true`
- `fontSize` (optional): Font size in pixels. Default: `16`

**Example:**
```json
{
  "latex": "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}",
  "outputPath": "/tmp/gaussian.svg"
}
```

## Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint and format
npm run check

# Build
npm run build

# Run in development mode
npm run dev
```

## License

MIT
