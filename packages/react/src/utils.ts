export const product = (a: any) =>
  !a || !a.length
    ? []
    : a.reduce((_a: any, b: any) => _a.flatMap((d: any) => b.map((e: any) => [...new Set([d, e].flat())])));

export const extractMedia = (media: string) => media.replace(/@media\s*(.*?\(.+\))\s*{.*}/gi, '$1').trim();
export const mergeQueries = (config: any, breakpointsToMerge: string[]) =>
  breakpointsToMerge
    .map((bp) => extractMedia(bp === 'initial' ? '' : config.breakpoints[bp]('')))
    .filter(Boolean)
    .join(' AND ');
export const createFinalMediaQueryFromCombinations = (config: any, combos: string[][]) =>
  product(combos).reduce((prev: any, curr: any) => {
    if (!prev) return mergeQueries(config, curr);
    if (!curr) return prev;
    return `${prev}, ${mergeQueries(config, curr)}`;
  }, '');

export const matchBreakpointObjAgainstVal = (breakpointObj: Record<string, any> | string, val: string) => {
  if (typeof breakpointObj !== 'object' && String(breakpointObj) === val) return ['initial'];
  const matchedBreakpoints = [];
  for (const [breakpoint, variantVal] of Object.entries(breakpointObj)) {
    if (variantVal === val) matchedBreakpoints.push(breakpoint);
  }
  return matchedBreakpoints;
};

export const resolveCompoundVariantIntoStyleObj = (
  props: Record<string, any>,
  [condition, compoundStyles]: [Record<string, string | number | boolean>, any],
  config: any
) => {
  const combos = [];
  for (const [key, val] of Object.entries(condition)) {
    const breakpointObj = props[key] && matchBreakpointObjAgainstVal(props[key], String(val));
    if (breakpointObj.length) {
      combos.push(breakpointObj);
    } else {
      // break out as a prop in the compound variant didn't match
      return null;
    }
  }
  const rule = createFinalMediaQueryFromCombinations(config, combos);
  return {
    _COMPOUND_VARIANTS: {
      [rule ? `@media ${rule}` : '']: compoundStyles,
    },
  };
};
