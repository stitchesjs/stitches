import { tokenTypes, isServer } from './constants';
import {
  ATOM,
  IAtom,
  IBreakpoints,
  IComposedAtom,
  ICssPropToToken,
  IKeyframesAtom,
  ISheet,
  IThemeAtom,
  ITokensDefinition,
  TConfig,
  TCss,
} from './types';
import { unitlessKeys } from './unitless';
import {
  MAIN_BREAKPOINT_ID,
  createSheets,
  cssPropToToken,
  getVendorPrefixAndProps,
  hashString,
  specificityProps,
} from './utils';
export * from './types';
export * from './css-types';
export * from './utils';

export const _ATOM = ATOM;

export const hotReloadingCache = new Map<string, any>();

const cleanSSRClass = (s: string) => {
  // removes the atom class marker & removes any escaping that was done on the server for the class
  return s.replace(/(\/\*X\*\/|\\([^-_a-zA-Z\d]*))/g, '$2');
};
const createSSRCssRuleClass = (s: string) => {
  return `/*X*/${s.replace(/[^-_a-zA-Z\d]/g, `\\$&`)}/*X*/`;
};

const createSelector = (className: string, selector: string) => {
  const cssRuleClassName = className ? `.${className}` : '';
  if (selector && selector.includes('%')) return selector.replace(/\%/gi, cssRuleClassName);
  if (selector) {
    return `${cssRuleClassName}${selector}`;
  }
  return cssRuleClassName;
};

/**
 * Resolves a token to its css value in the context of the passed css prop:
 */
const resolveTokens = (cssProp: string, value: any, tokens: any) => {
  const token: any = cssPropToToken[cssProp as keyof ICssPropToToken<any>];
  let tokenValue: any;
  if (token) {
    if (Array.isArray(token) && Array.isArray(value)) {
      tokenValue = token.map((tokenName, index) =>
        token && (tokens as any)[tokenName] && (tokens as any)[tokenName][value[index]]
          ? (tokens as any)[tokenName][value[index]]
          : value[index]
      );
    } else {
      tokenValue =
        token && (tokens as any)[token] && (tokens as any)[token][value] ? (tokens as any)[token][value] : value;
    }
  } else {
    tokenValue = value;
  }
  return tokenValue;
};

/**
 * Merges two selectors together while also handling pseudos correctly
 */
const mergeSelectors = (firstSelector: string, secondSelector: string) => {
  // a pseudo class and starts with &, normalize it:
  const normalizedSelector =
    secondSelector[0] === '&' && secondSelector[1] === ':' ? secondSelector.substr(1) : secondSelector;

  if (!firstSelector && normalizedSelector.indexOf('&') > -1) {
    return normalizedSelector.replace(/&/g, `%${firstSelector}`);
  }
  if (normalizedSelector.indexOf('&') > -1) {
    return normalizedSelector.replace(/&/g, firstSelector);
  }
  if (normalizedSelector[0] === ':') {
    return normalizedSelector.replace(':', `${firstSelector}:`);
  }
  return `${firstSelector} ${normalizedSelector.trim()}`;
};

// this is hacky as hell.
// we should experiment handling pseudo classes
// specificity via buckets in the sheet
const fixSpecificity = (selectorString: string) => {
  let _selectorString = selectorString;
  // We want certain pseudo selectors to take precedence over other pseudo
  // selectors, so we increase specificity
  if (_selectorString[0] === '%' || !_selectorString.match('%')) {
    if (_selectorString?.match(/\:hover/)) {
      _selectorString = `%${_selectorString}`;
    } else if (_selectorString?.match(/\:active/)) {
      _selectorString = `%%${_selectorString}`;
    } else if (_selectorString?.match(/\:focus|\:focus-visible/)) {
      _selectorString = `%%%${_selectorString}`;
    } else if (_selectorString?.match(/\:read-only/)) {
      _selectorString = `%%%%${_selectorString}`;
    } else if (_selectorString?.match(/\:disabled/)) {
      _selectorString = `%%%%%${_selectorString}`;
    }
  }
  return _selectorString;
};

const allPossibleCases = ([first, ...rest]: string[][]): string[] => {
  if (rest.length === 0) {
    if (first) {
      return first;
    }
    return [];
  } else {
    const result = [];
    const allCasesOfRest = allPossibleCases(rest);

    for (let i = 0; i < allCasesOfRest.length; i++) {
      for (let j = 0; j < first.length; j++) {
        result.push(mergeSelectors(first[j], allCasesOfRest[i]));
      }
    }
    return result;
  }
};

/**
 * iterates over a style object keys and values,
 * resolving them to their final form then calls the value callback with the prop, value
 * and the current value nesting path in the style object:
 * - handles utilities
 * - handles specificity props
 * - handles nesting
 * - TODO: also handle the things below once we handle envs differently (to avoid passing a lot of props around):
 * - handles tokens
 * - handles vendor prefixing
 */
const processStyleObject = (
  obj: any,
  config: TConfig<true>,
  valueMiddleware: (
    prop: string,
    value: string,
    breakpoint: string,
    mediaQueries: string[],
    nestingPath: string
  ) => void,
  nestingPath = '%',
  selectors: string[][] = [],
  breakpoint = MAIN_BREAKPOINT_ID,
  mediaQueries: string[] = [],
  shouldHandleUtils = true,
  shouldHandleSpecificityProps = true
) => {
  // key: css prop or override or a selector
  // value is: cssValue, a util, specificity prop, or
  for (const key of Object.keys(obj)) {
    const val = obj[key];

    /** Breakpoint */
    if (key in config.breakpoints) {
      processStyleObject(val, config, valueMiddleware, nestingPath, selectors, key, mediaQueries);
      continue;
    }

    /** Media query */
    if (key[0] === '@') {
      processStyleObject(val, config, valueMiddleware, nestingPath, selectors, breakpoint, [...mediaQueries, key]);
      continue;
    }

    /** Utils: */
    if (shouldHandleUtils && key in config.utils) {
      // Resolve the util from the util function:
      const resolvedUtils = config.utils[key](val, config);
      // prettier-ignore
      processStyleObject(resolvedUtils, config, valueMiddleware, nestingPath, selectors, breakpoint, mediaQueries, false);
      continue;
    }

    /**
     * Specificity Props:
     * shorthand css props or css props that has baked in handling:
     * see specificityProps in ./utils
     */
    if (!(key in config.utils) && shouldHandleSpecificityProps && key in specificityProps) {
      const resolvedSpecificityProps = specificityProps[key](config.tokens, val);
      // prettier-ignore
      processStyleObject(resolvedSpecificityProps, config, valueMiddleware, nestingPath, selectors, breakpoint, mediaQueries, false, false);
      continue;
    }

    /** Nested styles: */
    if (typeof val === 'object') {
      // Atom value:
      if (val[ATOM]) {
        valueMiddleware(key, val, breakpoint, mediaQueries, nestingPath);
        continue;
      }

      /**
       * handle path merging:
       */

      /** Current key is a comma separated rule */
      if (key.indexOf(',') > -1) {
        // split by comma and then merge it with he current nesting path
        const newSelectors = [...selectors, key.split(',').map((el) => mergeSelectors(nestingPath, el))];
        // reset the nesting path to '' as it's already no part of selectors
        processStyleObject(val, config, valueMiddleware, '', newSelectors, breakpoint, mediaQueries);
        continue;
      }

      /** Current key is a normal css selector */
      processStyleObject(
        val,
        config,
        valueMiddleware,
        // merging normal selectors
        // this is the case when we have no comma separated rules
        mergeSelectors(nestingPath, key),
        selectors,
        breakpoint,
        mediaQueries
      );
      continue;
    }

    /**
     * if we've reached this far, this means that we've reached a value
     * which we would then use inside the valueMiddleware
     */
    const stuff = nestingPath ? [...selectors, [nestingPath]] : selectors;
    const finalSelector = allPossibleCases(stuff).map(fixSpecificity).join(',');

    /** Unitless handling: */
    if (typeof val === 'number') {
      // handle unitless numbers:
      valueMiddleware(
        key,
        // tslint:disable-next-line: prefer-template
        `${unitlessKeys[key] ? val : val + 'px'}`,
        breakpoint,
        mediaQueries,
        finalSelector
      );
      continue;
    }

    /** Anything else other than undefined values */
    if (val !== undefined) {
      valueMiddleware(key, resolveTokens(key, val, config.tokens), breakpoint, mediaQueries, finalSelector);
    }
  }
};

/**
 * converts an object style css prop to its normal css style object prop and handles prefixing:
 * borderColor => border-color
 */
const hyphenAndVendorPrefixCssProp = (cssProp: string, vendorProps: any[], vendorPrefix: string) => {
  const isVendorPrefixed = cssProp[0] === cssProp[0].toUpperCase();
  let cssHyphenProp = cssProp
    .split(/(?=[A-Z])/)
    .map((g) => g.toLowerCase())
    .join('-');

  if (isVendorPrefixed) {
    cssHyphenProp = `-${cssHyphenProp}`;
  } else if (vendorProps.includes(`${vendorPrefix}${cssHyphenProp}`)) {
    cssHyphenProp = `${vendorPrefix}${cssHyphenProp}`;
  }
  return cssHyphenProp;
};

const toStringCachedAtom = function (this: IAtom | IComposedAtom) {
  return this._className!;
};

const toStringCompose = function (this: IComposedAtom) {
  const className = this.atoms.map((atom) => atom.toString()).join(' ');
  // cache the className on this instance
  // @ts-ignore
  this._className = className;
  // we only want to enable caching on the client
  // because on the server we want to make sure that the composition is evaluated on each request
  if (!isServer) {
    this.toString = toStringCachedAtom;
  }
  return className;
};

const createCssRule = (breakpoints: IBreakpoints, atom: IAtom, className: string) => {
  let cssRule = '';
  if (atom.inlineMediaQueries && atom.inlineMediaQueries.length) {
    let allMediaQueries = '';
    let endBrackets = '';
    atom.inlineMediaQueries.forEach((breakpoint) => {
      allMediaQueries += `${breakpoint}{`;
      endBrackets += '}';
    });

    cssRule = `${allMediaQueries}${createSelector(className, atom.selector)}{${atom.cssHyphenProp}:${
      atom.value
    };}${endBrackets}`;
  } else {
    cssRule = `${createSelector(className, atom.selector)}{${atom.cssHyphenProp}:${atom.value};}`;
  }

  return atom.breakpoint !== MAIN_BREAKPOINT_ID ? breakpoints[atom.breakpoint](cssRule) : cssRule;
};

const createToString = (
  sheets: { [breakpoint: string]: ISheet },
  breakpoints: IBreakpoints = {},
  cssClassnameProvider: (atom: IAtom) => string, // [className, pseudo]
  preInjectedRules: Set<string>
) => {
  return function toString(this: IAtom) {
    const className = cssClassnameProvider(this);
    const shouldInject = !preInjectedRules.size || !preInjectedRules.has(`.${className}`);

    if (shouldInject) {
      const sheet = sheets[this.breakpoint];
      sheet.insertRule(
        createCssRule(breakpoints, this, className),
        this.inlineMediaQueries.length ? sheet.cssRules.length : 0
      );
    }

    // We are switching this atom from IAtom simpler representation
    // 1. delete everything but `id` for specificity check

    // @ts-ignore
    this.cssHyphenProp = this.value = this.pseudo = this.breakpoint = this.inlineMediaQueries = undefined;

    // 2. put on a _className
    this._className = className;

    // 3. switch from this `toString` to a much simpler one
    this.toString = toStringCachedAtom;

    return className;
  };
};

const createServerToString = (
  sheets: { [mediaQuery: string]: ISheet },
  breakpoints: IBreakpoints = {},
  cssClassnameProvider: (atom: IAtom) => string
) => {
  return function toString(this: IAtom) {
    const className = cssClassnameProvider(this);

    const sheet = sheets[this.breakpoint];
    sheets[this.breakpoint].insertRule(
      createCssRule(breakpoints, this, className.length ? createSSRCssRuleClass(className) : ''),
      this.inlineMediaQueries.length ? sheet.cssRules.length : 0
    );

    // We do not clean out the atom here, cause it will be reused
    // to inject multiple times for each request

    // 1. put on a _className
    this._className = className;

    // 2. switch from this `toString` to a much simpler one
    this.toString = toStringCachedAtom;

    return className;
  };
};

const createThemeToString = (classPrefix: string, variablesSheet: ISheet) =>
  function toString(this: IThemeAtom) {
    const themeClassName = `${classPrefix ? `${classPrefix}-` : ''}theme-${this.name}`;

    // @ts-ignore
    variablesSheet.insertRule(
      `.${themeClassName}{${Object.keys(this.definition).reduce((aggr, tokenType) => {
        // @ts-ignore
        return `${aggr}${Object.keys(this.definition[tokenType]).reduce((subAggr, tokenKey) => {
          return `${subAggr}--${tokenType}-${tokenKey.replace(/[^\w\s-]/gi, '')}:${
            // @ts-ignore
            this.definition[tokenType][tokenKey]
          };`;
        }, aggr)}`;
      }, '')}}`
    );

    this.toString = () => themeClassName;

    return themeClassName;
  };

const createKeyframesToString = (sheet: ISheet) =>
  function toString(this: IKeyframesAtom) {
    if (this._cssRuleString) {
      sheet.insertRule(this._cssRuleString);
    }

    this.toString = () => this.id;

    return this.id;
  };

const composeIntoMap = (map: Map<string, IAtom>, atoms: (IAtom | IComposedAtom)[]) => {
  let i = atoms.length - 1;
  for (; i >= 0; i--) {
    const item = atoms[i];
    // atoms can be undefined, null, false or '' using ternary like
    // expressions with the properties
    if (item && item[ATOM] && 'atoms' in item) {
      composeIntoMap(map, item.atoms);
    } else if (item && item[ATOM]) {
      if (!map.has((item as IAtom).id)) {
        map.set((item as IAtom).id, item as IAtom);
      }
    } else if (item) {
      map.set((item as unknown) as string, item as IAtom);
    }
  }
};

declare global {
  interface Window {
    Deno: any;
  }
}

export const createTokens = <T extends ITokensDefinition>(tokens: T) => {
  return tokens;
};
export const createCss = <T extends TConfig>(
  _config: T,
  // Check against Deno env explicitly #199
  env: Window | null = typeof window === 'undefined' || window?.Deno ? null : window
): TCss<T> => {
  // pre-checked config to avoid checking these all the time
  // tslint:disable-next-line
  const config: TConfig<true> = Object.assign({ tokens: {}, utils: {}, breakpoints: {} }, _config);
  // prefill with empty token groups
  tokenTypes.forEach((tokenType) => (config.tokens[tokenType] = config.tokens[tokenType] || {}));
  const { tokens, breakpoints } = config;

  const showFriendlyClassnames =
    typeof config.showFriendlyClassnames === 'boolean'
      ? config.showFriendlyClassnames
      : process.env.NODE_ENV === 'development';
  const prefix = config.prefix || '';
  const { vendorPrefix, vendorProps } = env
    ? getVendorPrefixAndProps(env)
    : { vendorPrefix: '-node-', vendorProps: [] };

  if (env && hotReloadingCache.has(prefix)) {
    const instance = hotReloadingCache.get(prefix);
    instance.dispose();
  }

  // pre-compute class prefix
  const classPrefix = prefix ? (showFriendlyClassnames ? `${prefix}_` : prefix) : '';
  const cssClassnameProvider = (atom: IAtom): string => {
    if (atom._isGlobal) {
      return '';
    }
    const hash = hashString(
      `${atom.breakpoint || ''}${atom.cssHyphenProp.replace(/-(moz|webkit|ms)-/, '')}${atom.selector || ''}${
        atom.inlineMediaQueries?.join('') || ''
      }${atom.value}`
    );
    const name = showFriendlyClassnames
      ? // HTML has this weird treatment to css classes. it's ok if they start with everything except digits
        // where in CSS a class can only start with an underscore (_), a hyphen (-) or a letter (a-z)/(A-Z)
        // so we're prefixing the breakpoint with _ incase the user sets an invalid character at the start of the string
        `${atom.breakpoint ? `_${atom.breakpoint}_` : ''}${atom.cssHyphenProp
          .replace(/-(moz|webkit|ms)-/, '')
          .split('-')
          .map((part) => part[0])
          .join('')}_${hash}`
      : `_${hash}`;

    return `${classPrefix}${name}`;
  };

  const { tags, sheets } = createSheets(env, config.breakpoints);
  const preInjectedRules = new Set<string>();
  // tslint:disable-next-line
  for (const tag of tags) {
    ((tag.textContent || '').match(/\/\*\X\*\/.*?\/\*\X\*\//g) || []).forEach((rule) => {
      // tslint:disable-next-line
      preInjectedRules.add('.' + cleanSSRClass(rule));
    });
  }

  let toString = env
    ? createToString(sheets, config.breakpoints, cssClassnameProvider, preInjectedRules)
    : createServerToString(sheets, config.breakpoints, cssClassnameProvider);

  let themeToString = createThemeToString(classPrefix, sheets.__variables__);
  let keyframesToString = createKeyframesToString(sheets.__keyframes__);
  const compose = (...atoms: IAtom[]): IComposedAtom => {
    const map = new Map<string, IAtom>();
    composeIntoMap(map, atoms);
    return {
      atoms: Array.from(map.values()),
      toString: toStringCompose,
      [ATOM]: true,
    };
  };
  const createAtom = (
    cssProp: string,
    value: any,
    breakpoint = MAIN_BREAKPOINT_ID,
    selectorString: string,
    inlineMediaQueries: string[],
    isGlobal?: boolean
  ) => {
    // generate id used for specificity check
    // two atoms are considered equal in regard to there specificity if the id is equal
    const inlineMediasAsString = inlineMediaQueries ? inlineMediaQueries.join('') : '';
    const id =
      cssProp.toLowerCase() + selectorString + (inlineMediaQueries ? inlineMediaQueries.join('') : '') + breakpoint;

    // make a uid accouting for different values
    const uid = id + value;

    // If this was created before return the cached atom
    if (atomCache.has(uid)) {
      // check if this has a breakpoint based media query
      if (inlineMediasAsString.match(/@media.*\((min|max)?.*(width|height).*\)/)) {
        // tslint:disable-next-line
        console.warn(
          `The property "${cssProp}" with media query ${inlineMediasAsString} can cause a specificity issue. You should create a breakpoint`
        );
      }
      return atomCache.get(uid)!;
    }

    // prepare the cssProp
    const cssHyphenProp = hyphenAndVendorPrefixCssProp(cssProp, vendorProps, vendorPrefix);

    // Create a new atom
    const atom: IAtom = {
      id,
      cssHyphenProp,
      value,
      selector: selectorString,
      inlineMediaQueries,
      breakpoint,
      toString,
      [ATOM]: true,
      _isGlobal: isGlobal,
    };

    // Cache it
    atomCache.set(uid, atom);

    return atom;
  };

  let baseTokens = ':root{';
  // tslint:disable-next-line
  for (const tokenType in tokens) {
    const isNumericScale = tokenType.match(/^(sizes|space|letterSpacings|zIndices)$/);
    // @ts-ignore
    // tslint:disable-next-line
    const scaleTokenKeys = Object.keys(tokens[tokenType]);
    for (let index = 0; index < scaleTokenKeys.length; index++) {
      const token = scaleTokenKeys[index];
      // format token to remove special characters
      // https://stackoverflow.com/a/4374890
      const formattedToken = token.replace(/[^\w\s-]/gi, '');
      const cssVar = `--${tokenType}-${formattedToken}`;

      // @ts-ignore
      baseTokens += `${cssVar}:${tokens[tokenType][token]};`;

      // @ts-ignore
      tokens[tokenType][token] = `var(${cssVar})`;

      // Add negative tokens
      // tslint:disable-next-line: prefer-template
      const negativeTokenKey = '-' + token;
      // check that it's a numericScale and that the user didn't already set a negative token witht this name
      const isAlreadyANegativeToken =
        // @ts-ignore
        token[0] === '-' ? !!tokens[tokenType][token.substring(1)] : false;
      if (
        isNumericScale &&
        // @ts-ignore
        !tokens[tokenType][negativeTokenKey] &&
        !isAlreadyANegativeToken
      ) {
        // @ts-ignore
        tokens[tokenType][negativeTokenKey] = `calc(var(${cssVar}) * -1)`;
      }
    }
  }
  baseTokens += '}';

  if (!preInjectedRules.has(':root')) {
    sheets.__variables__.insertRule(baseTokens);
  }
  // Keeping track of all atoms for SSR
  const atomCache = new Map<string, IAtom>();
  const keyFramesCache = new Map<string, IKeyframesAtom>();
  const themeCache = new Map<ITokensDefinition, IThemeAtom>();
  const cssInstance = ((...definitions: any[]) => {
    const args: any[] = [];
    let index = 0;

    for (let x = 0; x < definitions.length; x++) {
      if (!definitions[x]) {
        continue;
      }
      if (typeof definitions[x] === 'string' || definitions[x][ATOM]) {
        args[index++] = definitions[x];
      } else {
        processStyleObject(definitions[x], config, (prop, value, breakpoint, mediaQueries, path) => {
          args[index++] = createAtom(prop, value, breakpoint, path, mediaQueries);
        });
      }
    }
    // might cause memory leaks when doing css() inside a component
    // but we need this for now to fix SSR
    const composition = compose(...args);

    return composition;
  }) as any;

  cssInstance.dispose = () => {
    atomCache.clear();
    tags.forEach((tag) => {
      tag.parentNode?.removeChild(tag);
    });
  };
  cssInstance._config = () => config;
  cssInstance.theme = (definition: any): IThemeAtom => {
    if (themeCache.has(definition)) {
      return themeCache.get(definition)!;
    }

    const themeAtom = {
      // We could here also check if theme has been added from server,
      // though thinking it does not matter... just a simple rule
      name: String(themeCache.size),
      definition,
      toString: themeToString,
      [ATOM]: true as true,
    };

    themeCache.set(definition, themeAtom);

    return themeAtom;
  };

  cssInstance.global = (definitions: any) => {
    const atoms: IAtom[] = [];
    processStyleObject(definitions, config, (prop, value, breakpoint, mediaQueries, path) => {
      if (path === '%') {
        throw new Error('Global styles need to be nested within a selector');
      }
      // Create a global atom and call toString() on it directly to inject it
      // as global atoms don't generate class names of their own
      atoms.push(createAtom(prop, value, breakpoint, path, mediaQueries, true));
    });
    return () => compose(...atoms).toString();
  };

  cssInstance.keyframes = (definition: any): IKeyframesAtom => {
    let cssRule = '';
    let currentTimeProp = '';
    processStyleObject(definition, config, (key, value, _, __, timeProp) => {
      if (timeProp !== currentTimeProp) {
        if (cssRule) {
          cssRule += `}`;
        }
        currentTimeProp = timeProp;
        cssRule += `${timeProp.substr(2)} {`;
      }
      cssRule += `${hyphenAndVendorPrefixCssProp(key, vendorProps, vendorPrefix)}: ${resolveTokens(
        key,
        value,
        tokens
      )};`;
    });
    cssRule += `}`;

    const hash = hashString(cssRule);
    // Check if an atom exist with the same hash and return it if so
    const cachedAtom = keyFramesCache.get(hash);
    if (cachedAtom) {
      return cachedAtom;
    }
    // wrap it with the generated keyframes name
    cssRule = `@keyframes ${hash} {${cssRule}}`;
    const keyframesAtom = {
      id: String(hash),
      _cssRuleString: cssRule,
      toString: keyframesToString,
      [ATOM]: true as true,
    };
    keyFramesCache.set(hash, keyframesAtom);
    return keyframesAtom;
  };

  cssInstance.getStyles = (cb: any) => {
    // tslint:disable-next-line
    for (let sheet in sheets) {
      if (sheet !== '__keyframes__') {
        sheets[sheet].cssRules.length = 0;
      }
    }
    if (baseTokens) {
      sheets.__variables__.insertRule(baseTokens);
    }

    // We have to reset our toStrings so that they will now inject again,
    // and still cache is it is being reused
    toString = createServerToString(sheets, config.breakpoints, cssClassnameProvider);
    keyframesToString = createKeyframesToString(sheets[MAIN_BREAKPOINT_ID]);
    themeToString = createThemeToString(classPrefix, sheets.__variables__);

    atomCache.forEach((atom) => {
      atom.toString = toString;
    });

    keyFramesCache.forEach((atom) => {
      atom.toString = keyframesToString;
    });

    themeCache.forEach((atom) => {
      atom.toString = themeToString;
    });

    const result = cb();

    return {
      result,
      styles: Object.keys(breakpoints).reduce(
        (aggr, key) => {
          return aggr.concat(`/* STITCHES:${key} */\n${sheets[key].cssRules.join('\n')}`);
        },
        [
          `/* STITCHES:__variables__ */\n${sheets.__variables__.cssRules.join('\n')}`,
          `/* STITCHES:__keyframes__ */\n${sheets.__keyframes__.cssRules.join('\n')}`,
          `/* STITCHES */\n${sheets[MAIN_BREAKPOINT_ID].cssRules.join('\n')}`,
        ]
      ),
    };
  };

  if (env) {
    hotReloadingCache.set(prefix, cssInstance);
  }

  return cssInstance;
};
