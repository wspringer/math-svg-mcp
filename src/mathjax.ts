import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { SVG } from 'mathjax-full/js/output/svg.js';

export interface ConversionOptions {
  /** Display mode (block) vs inline mode. Default: true */
  display?: boolean;
  /** Font size in pixels for em calculations. Default: 16 */
  fontSize?: number;
  /** Container width for line breaking calculations. Default: 800 */
  containerWidth?: number;
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
 * Convert LaTeX math expression to SVG
 */
export function latexToSvg(
  latex: string,
  options: ConversionOptions = {},
): ConversionResult {
  const { display = true, fontSize = 16, containerWidth = 800 } = options;

  const { document: doc, adaptor } = getMathJax();

  const node = doc.convert(latex, {
    display,
    em: fontSize,
    ex: fontSize / 2,
    containerWidth,
  });

  const svgString = adaptor.outerHTML(node);

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
