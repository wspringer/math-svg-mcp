import { beforeEach, describe, expect, it } from 'vitest';
import { latexToSvg, resetMathJax } from './mathjax.js';

describe('latexToSvg', () => {
  beforeEach(() => {
    resetMathJax();
  });

  it('converts a simple fraction to SVG', () => {
    const result = latexToSvg('\\frac{1}{2}');

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
    expect(result.width).not.toBe('unknown');
    expect(result.height).not.toBe('unknown');
  });

  it('converts a quadratic formula to SVG', () => {
    const result = latexToSvg('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
  });

  it('converts an integral to SVG', () => {
    const result = latexToSvg('\\int_0^\\infty e^{-x^2} dx');

    expect(result.svg).toContain('<svg');
  });

  it('converts a matrix to SVG', () => {
    const result = latexToSvg(
      '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
    );

    expect(result.svg).toContain('<svg');
  });

  it('handles inline mode', () => {
    const displayResult = latexToSvg('x^2', { display: true });
    const inlineResult = latexToSvg('x^2', { display: false });

    expect(displayResult.svg).toContain('<svg');
    expect(inlineResult.svg).toContain('<svg');
    // Both should produce valid SVG, may have different styling
  });

  it('handles different font sizes', () => {
    const small = latexToSvg('x', { fontSize: 12 });
    const large = latexToSvg('x', { fontSize: 24 });

    expect(small.svg).toContain('<svg');
    expect(large.svg).toContain('<svg');
  });

  it('converts Greek letters', () => {
    const result = latexToSvg('\\alpha + \\beta = \\gamma');

    expect(result.svg).toContain('<svg');
  });

  it('converts summation notation', () => {
    const result = latexToSvg('\\sum_{i=1}^{n} i^2');

    expect(result.svg).toContain('<svg');
  });

  it('converts limits', () => {
    const result = latexToSvg('\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1');

    expect(result.svg).toContain('<svg');
  });

  it('produces consistent dimensions for the same input', () => {
    const result1 = latexToSvg('a + b');
    const result2 = latexToSvg('a + b');

    // SVG IDs increment, so exact match isn't expected, but dimensions should match
    expect(result1.width).toBe(result2.width);
    expect(result1.height).toBe(result2.height);
  });

  it('handles empty input gracefully', () => {
    const result = latexToSvg('');

    expect(result.svg).toContain('<svg');
  });

  it('handles complex nested expressions', () => {
    const result = latexToSvg('\\sqrt{\\frac{\\sum_{i=1}^n x_i^2}{n}}');

    expect(result.svg).toContain('<svg');
  });
});
