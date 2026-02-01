#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { latexToSvg } from './mathjax.js';

const server = new McpServer({
  name: 'math-svg-mcp',
  version: '1.0.0',
});

// Tool: Convert LaTeX to SVG and return it directly
server.tool(
  'latex_to_svg',
  'Convert a LaTeX math expression to SVG and return the SVG content directly. Best for small expressions where you need the SVG inline.',
  {
    latex: z.string().describe('The LaTeX math expression to convert'),
    display: z
      .boolean()
      .optional()
      .describe('Display mode (block) vs inline mode. Default: true'),
    fontSize: z
      .number()
      .optional()
      .describe('Font size in pixels for calculations. Default: 16'),
  },
  async ({ latex, display, fontSize }) => {
    try {
      const result = latexToSvg(latex, { display, fontSize });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                svg: result.svg,
                width: result.width,
                height: result.height,
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
    display: z
      .boolean()
      .optional()
      .describe('Display mode (block) vs inline mode. Default: true'),
    fontSize: z
      .number()
      .optional()
      .describe('Font size in pixels for calculations. Default: 16'),
  },
  async ({ latex, outputPath, display, fontSize }) => {
    try {
      const result = latexToSvg(latex, { display, fontSize });

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
