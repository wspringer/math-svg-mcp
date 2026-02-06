import { beforeEach, describe, expect, it } from 'vitest';
import { latexToSvg, resetMathJax } from './mathjax.js';

describe('latexToSvg', () => {
  beforeEach(() => {
    resetMathJax();
  });

  it('converts a simple fraction to SVG', async () => {
    const result = await latexToSvg('\\frac{1}{2}', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
    expect(result.width).not.toBe('unknown');
    expect(result.height).not.toBe('unknown');
  });

  it('converts a quadratic formula to SVG', async () => {
    const result = await latexToSvg(
      'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      {
        unit: 'pt',
      },
    );

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
  });

  it('converts an integral to SVG', async () => {
    const result = await latexToSvg('\\int_0^\\infty e^{-x^2} dx', {
      unit: 'pt',
    });

    expect(result.svg).toContain('<svg');
  });

  it('converts a matrix to SVG', async () => {
    const result = await latexToSvg(
      '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
      { unit: 'pt' },
    );

    expect(result.svg).toContain('<svg');
  });

  it('handles inline mode', async () => {
    const displayResult = await latexToSvg('x^2', {
      display: true,
      unit: 'pt',
    });
    const inlineResult = await latexToSvg('x^2', {
      display: false,
      unit: 'pt',
    });

    expect(displayResult.svg).toContain('<svg');
    expect(inlineResult.svg).toContain('<svg');
    // Both should produce valid SVG, may have different styling
  });

  it('handles different font sizes', async () => {
    const small = await latexToSvg('x', { fontSize: 12, unit: 'pt' });
    const large = await latexToSvg('x', { fontSize: 24, unit: 'pt' });

    expect(small.svg).toContain('<svg');
    expect(large.svg).toContain('<svg');
  });

  it('converts Greek letters', async () => {
    const result = await latexToSvg('\\alpha + \\beta = \\gamma', {
      unit: 'pt',
    });

    expect(result.svg).toContain('<svg');
  });

  it('converts summation notation', async () => {
    const result = await latexToSvg('\\sum_{i=1}^{n} i^2', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
  });

  it('converts limits', async () => {
    const result = await latexToSvg('\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', {
      unit: 'pt',
    });

    expect(result.svg).toContain('<svg');
  });

  it('produces consistent dimensions for the same input', async () => {
    const result1 = await latexToSvg('a + b', { unit: 'pt' });
    const result2 = await latexToSvg('a + b', { unit: 'pt' });

    // SVG IDs increment, so exact match isn't expected, but dimensions should match
    expect(result1.width).toBe(result2.width);
    expect(result1.height).toBe(result2.height);
  });

  it('handles empty input gracefully', async () => {
    const result = await latexToSvg('', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
  });

  it('handles complex nested expressions', async () => {
    const result = await latexToSvg('\\sqrt{\\frac{\\sum_{i=1}^n x_i^2}{n}}', {
      unit: 'pt',
    });

    expect(result.svg).toContain('<svg');
  });

  it('outputs correct unit suffix for each unit type', async () => {
    const ptResult = await latexToSvg('x', { unit: 'pt' });
    const pxResult = await latexToSvg('x', { unit: 'px' });
    const mmResult = await latexToSvg('x', { unit: 'mm' });
    const exResult = await latexToSvg('x', { unit: 'ex' });

    expect(ptResult.width).toMatch(/pt$/);
    expect(pxResult.width).toMatch(/px$/);
    expect(mmResult.width).toMatch(/mm$/);
    expect(exResult.width).toMatch(/ex$/);
  });

  it('respects xHeightRatio parameter', async () => {
    const defaultRatio = await latexToSvg('x', { unit: 'pt', fontSize: 10 });
    const smallerRatio = await latexToSvg('x', {
      unit: 'pt',
      fontSize: 10,
      xHeightRatio: 0.45,
    });

    // With smaller xHeightRatio, the output should be smaller
    const defaultWidth = Number.parseFloat(defaultRatio.width);
    const smallerWidth = Number.parseFloat(smallerRatio.width);

    expect(smallerWidth).toBeLessThan(defaultWidth);
  });

  it('returns depth for baseline alignment', async () => {
    // Fractions extend below baseline, so depth should be non-zero
    const result = await latexToSvg('\\frac{1}{2}', { unit: 'pt' });

    expect(result.depth).toBeDefined();
    expect(result.depth).toMatch(/pt$/);

    const depthValue = Number.parseFloat(result.depth);
    expect(depthValue).toBeGreaterThan(0);
  });

  it('returns zero depth for expressions on baseline', async () => {
    // Simple 'x' sits on the baseline, depth should be 0 or very small
    const result = await latexToSvg('x', { unit: 'pt' });

    expect(result.depth).toBeDefined();
    const depthValue = Number.parseFloat(result.depth);
    expect(depthValue).toBeLessThan(1); // Should be essentially 0
  });

  it('uses modern font by default', async () => {
    const result = await latexToSvg('x^2', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
  });

  it('accepts explicit modern font parameter', async () => {
    const result = await latexToSvg('x^2', { unit: 'pt', font: 'modern' });

    expect(result.svg).toContain('<svg');
  });
});
