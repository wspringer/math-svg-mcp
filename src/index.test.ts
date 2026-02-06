import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { latexToSvg } from './mathjax.js';

describe('latex_to_svg_file integration', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `math-svg-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('writes SVG to file correctly', async () => {
    const result = await latexToSvg('E = mc^2', { unit: 'pt' });
    const outputPath = join(testDir, 'equation.svg');

    await writeFile(outputPath, result.svg, 'utf-8');
    const content = await readFile(outputPath, 'utf-8');

    expect(content).toContain('<svg');
    expect(content).toContain('</svg>');
  });

  it('creates nested directories for output', async () => {
    const result = await latexToSvg('\\pi r^2', { unit: 'pt' });
    const outputPath = join(testDir, 'nested', 'deep', 'equation.svg');

    await mkdir(join(testDir, 'nested', 'deep'), { recursive: true });
    await writeFile(outputPath, result.svg, 'utf-8');
    const content = await readFile(outputPath, 'utf-8');

    expect(content).toContain('<svg');
  });

  it('overwrites existing files', async () => {
    const outputPath = join(testDir, 'overwrite.svg');

    // Write first version
    const result1 = await latexToSvg('x', { unit: 'pt' });
    await writeFile(outputPath, result1.svg, 'utf-8');

    // Write second version
    const result2 = await latexToSvg('y', { unit: 'pt' });
    await writeFile(outputPath, result2.svg, 'utf-8');

    const content = await readFile(outputPath, 'utf-8');
    expect(content).toBe(result2.svg);
  });
});

describe('SVG output validation', () => {
  it('produces valid SVG structure', async () => {
    const result = await latexToSvg('\\frac{a}{b}', { unit: 'pt' });

    // Check for required SVG elements
    expect(result.svg).toMatch(/<svg[^>]*xmlns/);
    expect(result.svg).toContain('</svg>');
  });

  it('includes viewBox in SVG', async () => {
    const result = await latexToSvg('x + y', { unit: 'pt' });

    // MathJax SVGs should have viewBox for proper scaling
    expect(result.svg).toMatch(/viewBox=/);
  });

  it('produces standalone SVG that can be embedded', async () => {
    const result = await latexToSvg('\\sqrt{2}', { unit: 'pt' });

    // Should be a complete SVG that can stand alone (no mjx-container wrapper)
    expect(result.svg).toMatch(/^<svg[^>]*>/);
    expect(result.svg).not.toContain('mjx-container');
  });
});
