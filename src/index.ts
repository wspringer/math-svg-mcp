#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, resolve } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { latexToSvg } from './mathjax.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const server = new McpServer({
  name: 'math-svg-mcp',
  version,
});

// Tool: Convert LaTeX to SVG and return it directly
server.tool(
  'latex_to_svg',
  'Convert a LaTeX math expression to SVG and return the SVG content directly. Best for small expressions where you need the SVG inline.',
  {
    latex: z.string().describe('The LaTeX math expression to convert'),
    unit: z
      .enum(['pt', 'px', 'mm', 'ex'])
      .describe(
        'Output unit for width/height. Use pt for print/InDesign, px for web/browsers, mm for metric print, ex to keep relative units',
      ),
    display: z
      .boolean()
      .optional()
      .describe('Display mode (block) vs inline mode. Default: true'),
    fontSize: z
      .number()
      .optional()
      .describe(
        'Font size (em size) in the same unit as the output. E.g., 11 for 11pt when unit=pt, or 16 for 16px when unit=px. Default: 16',
      ),
    xHeightRatio: z
      .number()
      .optional()
      .describe(
        'Ratio of x-height to font size. Varies by font: Times 0.45, Helvetica 0.52, Computer Modern 0.43. Default: 0.5',
      ),
  },
  async ({ latex, unit, display, fontSize, xHeightRatio }) => {
    try {
      const result = latexToSvg(latex, {
        display,
        fontSize,
        xHeightRatio,
        unit,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                svg: result.svg,
                width: result.width,
                height: result.height,
                depth: result.depth,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `Error converting LaTeX: ${message}` }],
        isError: true,
      };
    }
  },
);

// Tool: Convert LaTeX to SVG and save to file
server.tool(
  'latex_to_svg_file',
  'Convert a LaTeX math expression to SVG and save it to a file. Best for larger expressions or when you need to reference the SVG by path.',
  {
    latex: z.string().describe('The LaTeX math expression to convert'),
    outputPath: z
      .string()
      .describe('The file path where the SVG should be saved'),
    unit: z
      .enum(['pt', 'px', 'mm', 'ex'])
      .describe(
        'Output unit for width/height. Use pt for print/InDesign, px for web/browsers, mm for metric print, ex to keep relative units',
      ),
    display: z
      .boolean()
      .optional()
      .describe('Display mode (block) vs inline mode. Default: true'),
    fontSize: z
      .number()
      .optional()
      .describe(
        'Font size (em size) in the same unit as the output. E.g., 11 for 11pt when unit=pt, or 16 for 16px when unit=px. Default: 16',
      ),
    xHeightRatio: z
      .number()
      .optional()
      .describe(
        'Ratio of x-height to font size. Varies by font: Times 0.45, Helvetica 0.52, Computer Modern 0.43. Default: 0.5',
      ),
  },
  async ({ latex, outputPath, unit, display, fontSize, xHeightRatio }) => {
    try {
      const result = latexToSvg(latex, {
        display,
        fontSize,
        xHeightRatio,
        unit,
      });

      // Resolve to absolute path
      const absolutePath = isAbsolute(outputPath)
        ? outputPath
        : resolve(process.cwd(), outputPath);

      // Ensure directory exists
      await mkdir(dirname(absolutePath), { recursive: true });

      // Write the SVG file
      await writeFile(absolutePath, result.svg, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                path: absolutePath,
                width: result.width,
                height: result.height,
                depth: result.depth,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          { type: 'text', text: `Error converting LaTeX to file: ${message}` },
        ],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
