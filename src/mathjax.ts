import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { SVG } from 'mathjax-full/js/output/svg.js';

export type OutputUnit = 'pt' | 'px' | 'mm' | 'ex';

export interface ConversionOptions {
  /** Display mode (block) vs inline mode. Default: true */
  display?: boolean;
  /** Font size (em size) for calculations. Default: 16 */
  fontSize?: number;
  /** Ratio of x-height to em size. Varies by font (Times: 0.45, Helvetica: 0.52). Default: 0.5 */
  xHeightRatio?: number;
  /** Container width for line breaking calculations. Default: 800 */
  containerWidth?: number;
  /** Output unit for width/height. Required. */
  unit: OutputUnit;
}

export interface ConversionResult {
  svg: string;
  width: string;
  height: string;
}

// Singleton for the MathJax document
let mjDocument: ReturnType<typeof mathjax.document> | null = null;
let mjAdaptor: ReturnType<typeof liteAdaptor> | null = null;

function getMathJax() {
  if (!mjDocument || !mjAdaptor) {
    mjAdaptor = liteAdaptor();
    RegisterHTMLHandler(mjAdaptor);

    const tex = new TeX({ packages: AllPackages });
    const svg = new SVG({ fontCache: 'local' });

    mjDocument = mathjax.document('', { InputJax: tex, OutputJax: svg });
  }
  return { document: mjDocument, adaptor: mjAdaptor };
}

/**
 * Convert ex value to target unit
 */
function convertExToUnit(
  exValue: number,
  exSize: number,
  unit: OutputUnit,
): string {
  switch (unit) {
    case 'ex':
      // Keep original ex units
      return `${exValue.toFixed(3)}ex`;
    case 'pt':
      // ex * exSize gives points (exSize = fontSize/2)
      return `${(exValue * exSize).toFixed(3)}pt`;
    case 'px':
      // 1pt = 1.333px (at 96 DPI)
      return `${(exValue * exSize * 1.333).toFixed(3)}px`;
    case 'mm':
      // 1pt = 0.3528mm
      return `${(exValue * exSize * 0.3528).toFixed(3)}mm`;
  }
}

/**
 * Convert LaTeX math expression to SVG
 */
export function latexToSvg(
  latex: string,
  options: ConversionOptions,
): ConversionResult {
  const {
    display = true,
    fontSize = 16,
    xHeightRatio = 0.5,
    containerWidth = 800,
    unit,
  } = options;

  const { document: doc, adaptor } = getMathJax();

  // Calculate x-height from font size and ratio
  const exSize = fontSize * xHeightRatio;

  const node = doc.convert(latex, {
    display,
    em: fontSize,
    ex: exSize,
    containerWidth,
  });

  // Use innerHTML to get just the SVG element, not the mjx-container wrapper
  let svgString = adaptor.innerHTML(node);

  // MathJax outputs width/height in ex units
  // Convert to the requested output unit

  svgString = svgString.replace(
    /width="([0-9.]+)ex"/,
    (_, value) =>
      `width="${convertExToUnit(Number.parseFloat(value), exSize, unit)}"`,
  );
  svgString = svgString.replace(
    /height="([0-9.]+)ex"/,
    (_, value) =>
      `height="${convertExToUnit(Number.parseFloat(value), exSize, unit)}"`,
  );

  // Extract dimensions from the SVG
  const widthMatch = svgString.match(/width="([^"]+)"/);
  const heightMatch = svgString.match(/height="([^"]+)"/);

  return {
    svg: svgString,
    width: widthMatch?.[1] ?? 'unknown',
    height: heightMatch?.[1] ?? 'unknown',
  };
}

/**
 * Reset the MathJax instance (useful for testing)
 */
export function resetMathJax(): void {
  mjDocument = null;
  mjAdaptor = null;
}
