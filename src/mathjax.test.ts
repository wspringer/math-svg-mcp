import { beforeEach, describe, expect, it } from 'vitest';
import { latexToSvg, resetMathJax } from './mathjax.js';

describe('latexToSvg', () => {
  beforeEach(() => {
    resetMathJax();
  });

  it('converts a simple fraction to SVG', () => {
    const result = latexToSvg('\\frac{1}{2}', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
    expect(result.width).not.toBe('unknown');
    expect(result.height).not.toBe('unknown');
  });

  it('converts a quadratic formula to SVG', () => {
    const result = latexToSvg('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', {
      unit: 'pt',
    });

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
  });

  it('converts an integral to SVG', () => {
    const result = latexToSvg('\\int_0^\\infty e^{-x^2} dx', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
  });

  it('converts a matrix to SVG', () => {
    const result = latexToSvg(
      '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
      { unit: 'pt' },
    );

    expect(result.svg).toContain('<svg');
  });

  it('handles inline mode', () => {
    const displayResult = latexToSvg('x^2', { display: true, unit: 'pt' });
    const inlineResult = latexToSvg('x^2', { display: false, unit: 'pt' });

    expect(displayResult.svg).toContain('<svg');
    expect(inlineResult.svg).toContain('<svg');
    // Both should produce valid SVG, may have different styling
  });

  it('handles different font sizes', () => {
    const small = latexToSvg('x', { fontSize: 12, unit: 'pt' });
    const large = latexToSvg('x', { fontSize: 24, unit: 'pt' });

    expect(small.svg).toContain('<svg');
    expect(large.svg).toContain('<svg');
  });

  it('converts Greek letters', () => {
    const result = latexToSvg('\\alpha + \\beta = \\gamma', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
  });

  it('converts summation notation', () => {
    const result = latexToSvg('\\sum_{i=1}^{n} i^2', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
  });

  it('converts limits', () => {
    const result = latexToSvg('\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', {
      unit: 'pt',
    });

    expect(result.svg).toContain('<svg');
  });

  it('produces consistent dimensions for the same input', () => {
    const result1 = latexToSvg('a + b', { unit: 'pt' });
    const result2 = latexToSvg('a + b', { unit: 'pt' });

    // SVG IDs increment, so exact match isn't expected, but dimensions should match
    expect(result1.width).toBe(result2.width);
    expect(result1.height).toBe(result2.height);
  });

  it('handles empty input gracefully', () => {
    const result = latexToSvg('', { unit: 'pt' });

    expect(result.svg).toContain('<svg');
  });

  it('handles complex nested expressions', () => {
    const result = latexToSvg('\\sqrt{\\frac{\\sum_{i=1}^n x_i^2}{n}}', {
      unit: 'pt',
    });

    expect(result.svg).toContain('<svg');
  });

  it('outputs correct unit suffix for each unit type', () => {
    const ptResult = latexToSvg('x', { unit: 'pt' });
    const pxResult = latexToSvg('x', { unit: 'px' });
    const mmResult = latexToSvg('x', { unit: 'mm' });
    const exResult = latexToSvg('x', { unit: 'ex' });

    expect(ptResult.width).toMatch(/pt$/);
    expect(pxResult.width).toMatch(/px$/);
    expect(mmResult.width).toMatch(/mm$/);
    expect(exResult.width).toMatch(/ex$/);
  });

  it('respects xHeightRatio parameter', () => {
    const defaultRatio = latexToSvg('x', { unit: 'pt', fontSize: 10 });
    const smallerRatio = latexToSvg('x', {
      unit: 'pt',
      fontSize: 10,
      xHeightRatio: 0.45,
    });

    // With smaller xHeightRatio, the output should be smaller
    const defaultWidth = Number.parseFloat(defaultRatio.width);
    const smallerWidth = Number.parseFloat(smallerRatio.width);

    expect(smallerWidth).toBeLessThan(defaultWidth);
  });
});
