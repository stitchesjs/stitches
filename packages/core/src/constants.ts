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
// Note: when running Jest tests, make sure that the test file is running in node env
// if this constant was giving incorrect results.
export const isServer = typeof window === 'undefined';
