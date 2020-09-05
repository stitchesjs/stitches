export const tokenTypes = [
  'colors',
  'space',
  'fontSizes',
  'fonts',
  'fontWeights',
  'lineHeights',
  'letterSpacings',
  'sizes',
  'borderWidths',
  'borderStyles',
  'radii',
  'shadows',
  'zIndices',
  'transitions',
] as const;

export const isServer = typeof window === 'undefined';
export const isClient = !isServer;
