# math-svg-mcp

An MCP server that converts LaTeX math expressions to SVG.

Once configured, Claude (or your favorite AI assistant) is able to convert LaTeX math expressions to SVG. So you could, for instance, ask:

> Give me the Laplace transform formula as SVG

The assistant will generate the LaTeX:

```latex
\mathcal{L}\{f(t)\} = \int_0^\infty f(t) e^{-st} \, dt = F(s)
```

and use the tool to render it:

![Laplace transform](example.svg)

[![Works great with Sidekick for InDesign](sidekick-banner.svg)](https://sidekick.eastpole.nl?utm_source=github&utm_medium=readme&utm_campaign=math-svg-mcp)

## Quick Install (Claude Desktop)

Download and open the `.mcpb` file from the [latest release](https://github.com/wspringer/math-svg-mcp/releases/latest) to automatically configure Claude Desktop.

Or use this direct link: [math-svg-mcp.mcpb](https://github.com/wspringer/math-svg-mcp/releases/latest/download/math-svg-mcp.mcpb)

## Manual Configuration

### Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "math-svg": {
      "command": "npx",
      "args": ["-y", "math-svg-mcp"]
    }
  }
}
```

### Claude Code

Add to your Claude Code settings (`.claude/settings.json` or global settings):

```json
{
  "mcpServers": {
    "math-svg": {
      "command": "npx",
      "args": ["-y", "math-svg-mcp"]
    }
  }
}
```

Or run directly:

```bash
claude mcp add math-svg -- npx -y math-svg-mcp
```

### Other MCP Clients

Any MCP-compatible client can use this server with the same configuration pattern:

```json
{
  "command": "npx",
  "args": ["-y", "math-svg-mcp"]
}
```

### Global Installation (Optional)

For faster startup, install globally:

```bash
npm install -g math-svg-mcp
```

Then configure your client to use:

```json
{
  "command": "math-svg-mcp"
}
```

## Tools

### `latex_to_svg`

Converts a LaTeX expression to SVG and returns the content directly.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `latex` | Yes | — | LaTeX math expression |
| `unit` | Yes | — | Output unit: `pt`, `px`, `mm`, or `ex` |
| `display` | No | `true` | Display mode (block) vs inline |
| `fontSize` | No | `16` | Font size in the specified unit |
| `xHeightRatio` | No | `0.5` | Ratio of x-height to font size |
| `font` | No | `modern` | Math font (see [Available Fonts](#available-fonts)) |

**Example:** `E = mc^2`

### `latex_to_svg_file`

Converts a LaTeX expression to SVG and saves to a file.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `latex` | Yes | — | LaTeX math expression |
| `outputPath` | Yes | — | File path for the SVG |
| `unit` | Yes | — | Output unit: `pt`, `px`, `mm`, or `ex` |
| `display` | No | `true` | Display mode (block) vs inline |
| `fontSize` | No | `16` | Font size in the specified unit |
| `xHeightRatio` | No | `0.5` | Ratio of x-height to font size |
| `font` | No | `modern` | Math font (see [Available Fonts](#available-fonts)) |

**Example:** `\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}` → `/tmp/gaussian.svg`

## Available Fonts

The `font` parameter lets you choose from 10 math fonts. The default `modern` font (Latin Modern) is bundled; others are automatically downloaded on first use and cached in `~/.cache/math-svg-mcp/fonts/`.

| Font | Description |
|------|-------------|
| `modern` | Latin Modern (default, bundled) |
| `stix2` | STIX Two Math |
| `newcm` | New Computer Modern |
| `fira` | Fira Math |
| `bonum` | TeX Gyre Bonum |
| `pagella` | TeX Gyre Pagella |
| `schola` | TeX Gyre Schola |
| `termes` | TeX Gyre Termes |
| `dejavu` | DejaVu |
| `asana` | Asana Math |

## Requirements

- Node.js 18 or later

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
