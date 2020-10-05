export const product = (a: string[][]) =>
  !a ? [] : a.reduce<string[][]>((_a, b) => _a.flatMap((d) => b.map((e) => [...new Set([d, e].flat())])), []);
export const extractMedia = (media: string) => media.replace(/@media\s*(.*?\(.+\))\s*{.*}/gi, '$1').trim();
export const mergeQueries = (config: any, breakpointsToMerge: string[]) =>
  breakpointsToMerge.map((bp) => extractMedia(config.breakpoints[bp](''))).join(' AND ');
export const createFinalMediaQueryFromCombinations = (config: any, combos: string[][]) =>
  product(combos).reduce((prev, curr) => {
    if (!prev) return mergeQueries(config, curr);
    if (!curr) return prev;
    return `${prev}, ${mergeQueries(config, curr)}`;
  }, '');

export const matchBreakpointObjAgainstVal = (breakpointObj: Record<string, any>, val: string | number | boolean) => {
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
    const breakpointObj = props[key] && matchBreakpointObjAgainstVal(props[key], val);
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
