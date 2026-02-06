import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { TeXFont } from 'mathjax-full/js/output/svg/fonts/tex.js';
import pacote from 'pacote';

export type OutputUnit = 'pt' | 'px' | 'mm' | 'ex';

/** Supported math fonts */
export type FontName =
  | 'tex'
  | 'stix2'
  | 'newcm'
  | 'fira'
  | 'bonum'
  | 'pagella'
  | 'schola'
  | 'termes'
  | 'modern'
  | 'dejavu'
  | 'asana';

/** All available font names */
export const FONT_NAMES: FontName[] = [
  'tex',
  'stix2',
  'newcm',
  'fira',
  'bonum',
  'pagella',
  'schola',
  'termes',
  'modern',
  'dejavu',
  'asana',
];

export interface ConversionOptions {
  /** Display mode (block) vs inline mode. Default: true */
  display?: boolean;
  /** Font size (em size) in the same unit as 'unit'. Default: 16 */
  fontSize?: number;
  /** Ratio of x-height to em size. Varies by font (Times: 0.45, Helvetica: 0.52). Default: 0.5 */
  xHeightRatio?: number;
  /** Container width for line breaking calculations. Default: 800 */
  containerWidth?: number;
  /** Output unit for width/height. fontSize should be specified in this unit. Required. */
  unit: OutputUnit;
  /** Math font to use. Default: 'tex' */
  font?: FontName;
}

export interface ConversionResult {
  svg: string;
  width: string;
  height: string;
  /** Distance below the text baseline (for vertical alignment) */
  depth: string;
}

/** Cache directory for downloaded fonts */
const FONT_CACHE_DIR = join(homedir(), '.cache', 'math-svg-mcp', 'fonts');

/** Map of font name to npm package name */
const FONT_PACKAGES: Record<FontName, string> = {
  tex: '', // bundled with mathjax-full
  stix2: '@mathjax/mathjax-stix2-font',
  newcm: '@mathjax/mathjax-newcm-font',
  fira: '@mathjax/mathjax-fira-font',
  bonum: '@mathjax/mathjax-bonum-font',
  pagella: '@mathjax/mathjax-pagella-font',
  schola: '@mathjax/mathjax-schola-font',
  termes: '@mathjax/mathjax-termes-font',
  modern: '@mathjax/mathjax-modern-font',
  dejavu: '@mathjax/mathjax-dejavu-font',
  asana: '@mathjax/mathjax-asana-font',
};

interface MathJaxInstance {
  document: ReturnType<typeof mathjax.document>;
  adaptor: ReturnType<typeof liteAdaptor>;
}

// Cache MathJax instances per font
const mjCache = new Map<FontName, MathJaxInstance>();

// Shared adaptor (can be reused across fonts)
let sharedAdaptor: ReturnType<typeof liteAdaptor> | null = null;

/**
 * Load a font class, downloading it if necessary
 */
async function loadFont(fontName: FontName): Promise<typeof TeXFont> {
  if (fontName === 'tex') {
    // TeXFont is bundled with mathjax-full
    return TeXFont;
  }

  const fontDir = join(FONT_CACHE_DIR, fontName);
  const pkgName = FONT_PACKAGES[fontName];

  // Download if not cached
  if (!existsSync(fontDir)) {
    await pacote.extract(pkgName, fontDir);
  }

  // Import from cache - use file URL for dynamic import
  const fontModulePath = join(fontDir, 'mjs', 'svg.js');
  const fontModuleUrl = pathToFileURL(fontModulePath).href;
  const fontModule = await import(fontModuleUrl);

  // The font module exports a class like MathJaxStix2Font
  return fontModule.default;
}

/**
 * Get or create a MathJax instance for the given font
 */
async function getMathJax(font: FontName = 'tex'): Promise<MathJaxInstance> {
  const cached = mjCache.get(font);
  if (cached) {
    return cached;
  }

  // Create shared adaptor if needed
  if (!sharedAdaptor) {
    sharedAdaptor = liteAdaptor();
    RegisterHTMLHandler(sharedAdaptor);
  }

  // Load font and create SVG output processor
  const FontClass = await loadFont(font);
  const tex = new TeX({ packages: AllPackages });
  const svg = new SVG({ fontCache: 'local', font: new FontClass() });

  const document = mathjax.document('', { InputJax: tex, OutputJax: svg });

  const instance: MathJaxInstance = { document, adaptor: sharedAdaptor };
  mjCache.set(font, instance);

  return instance;
}

/**
 * Convert ex value to target unit.
 * exSize is already in the target unit (since fontSize is specified in that unit).
 */
function convertExToUnit(
  exValue: number,
  exSize: number,
  unit: OutputUnit,
): string {
  if (unit === 'ex') {
    // Keep original ex units
    return `${exValue.toFixed(3)}ex`;
  }
  // exSize is already in the target unit, so just multiply and append unit
  return `${(exValue * exSize).toFixed(3)}${unit}`;
}

/**
 * Convert LaTeX math expression to SVG
 */
export async function latexToSvg(
  latex: string,
  options: ConversionOptions,
): Promise<ConversionResult> {
  const {
    display = true,
    fontSize = 16,
    xHeightRatio = 0.5,
    containerWidth = 800,
    unit,
    font = 'tex',
  } = options;

  const { document: doc, adaptor } = await getMathJax(font);

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

  // Extract depth (distance below baseline) from vertical-align style
  // MathJax outputs: style="vertical-align: -2.159ex;" (negative = below baseline)
  const verticalAlignMatch = svgString.match(/vertical-align:\s*(-?[0-9.]+)ex/);
  const depthEx = verticalAlignMatch
    ? Math.abs(Number.parseFloat(verticalAlignMatch[1]))
    : 0;
  const depth = convertExToUnit(depthEx, exSize, unit);

  return {
    svg: svgString,
    width: widthMatch?.[1] ?? 'unknown',
    height: heightMatch?.[1] ?? 'unknown',
    depth,
  };
}

/**
 * Reset the MathJax instances (useful for testing)
 */
export function resetMathJax(): void {
  mjCache.clear();
  sharedAdaptor = null;
}
