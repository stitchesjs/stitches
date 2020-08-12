import {
  ATOM,
  IAtom,
  IComposedAtom,
  IConfig,
  ICssPropToToken,
  IScreens,
  ISheet,
  IThemeAtom,
  ITokensDefinition,
  IKeyframesAtom,
  TCss,
} from "./types";
import {
  createSheets,
  cssPropToToken,
  getVendorPrefixAndProps,
  hashString,
  specificityProps,
} from "./utils";

export * from "./types";
export * from "./css-types";

export const hotReloadingCache = new Map<string, any>();

const MAIN_SCREEN_ID = "";

const resolveTokens = (cssProp: string, value: any, tokens: any) => {
  const token: any = cssPropToToken[cssProp as keyof ICssPropToToken<any>];
  let tokenValue: any;
  if (token) {
    if (Array.isArray(token) && Array.isArray(value)) {
      tokenValue = token.map((tokenName, index) =>
        token &&
        (tokens as any)[tokenName] &&
        (tokens as any)[tokenName][value[index]]
          ? (tokens as any)[tokenName][value[index]]
          : value[index]
      );
    } else {
      tokenValue =
        token && (tokens as any)[token] && (tokens as any)[token][value]
          ? (tokens as any)[token][value]
          : value;
    }
  } else {
    tokenValue = value;
  }
  return tokenValue;
};
const callCallbackOnObjectValues = <T>(
  obj: any,
  callback: (key: string, value: string, extraData: T) => void,
  extraData: T
) => {
  for (const key in obj) {
    callback(key, obj[key], extraData);
  }
};

const resolveStyleObj = (
  obj: any,
  config: any,
  valueMiddleware: (
    prop: string,
    value: string,
    currentNestingPath: string[]
  ) => void,
  currentNestingPath: string[] = []
) => {
  // key: css prop or override or a selector
  // value is: cssValue, a util, specificity prop, or
  for (const key in obj) {
    const val = obj[key];

    /** Utils: */
    if (key in config.utils) {
      // Resolve the util from the util function:
      const resolvedUtils = config.utils[key](config)(val);
      // we handle specificityProps after we handle utils in case utils result in specificityProps
      for (const key in resolvedUtils) {
        if (key in specificityProps) {
          Object.assign(resolvedUtils, specificityProps[key](config)(val));
        }
      }
      // call the value middleware on all values:
      callCallbackOnObjectValues(
        resolvedUtils,
        valueMiddleware,
        currentNestingPath
      );
      continue;
    }
    const isSpecificityProp = key in specificityProps;
    /** Nested styles: */
    if (typeof val === "object" && !isSpecificityProp) {
      // Atom value:
      if (val[ATOM]) {
        valueMiddleware(key, val, currentNestingPath);
        continue;
      }
      // handle the value object
      resolveStyleObj(val, config, valueMiddleware, [
        ...currentNestingPath,
        key,
      ]);
      continue;
    }
    // shorthand css props or css props that has baked in handling:
    // see specificityProps in ./utils
    if (isSpecificityProp) {
      const resolvedSpecificityProps = specificityProps[key](config)(val);
      // Call the value middleware on all values:
      callCallbackOnObjectValues(
        resolvedSpecificityProps,
        valueMiddleware,
        currentNestingPath
      );
      continue;
    }
    // Normal css prop
    // Call the value middleware on it:
    valueMiddleware(key, val, currentNestingPath);
  }
};

const resolveScreenAndSelector = (nestingPath: string[], config: any) =>
  nestingPath.reduce(
    (acc, screenOrSelector, i) => {
      // utilityFirst selector specific resolution:
      const isOverride = config.utilityFirst && screenOrSelector === "override";
      if (isOverride) {
        // any level above 0
        if (i) {
          throw new Error(
            `@stitches/css - You can not override at this level [${nestingPath
              .slice(0, i - 1)
              .join(
                ", "
              )}, -> ${screenOrSelector}], only at the top level definition`
          );
        }
        return acc;
      }
      // Screens handling:
      if (screenOrSelector in config.screens) {
        if (acc.screen !== MAIN_SCREEN_ID) {
          throw new Error(
            `@stitches/css - You are nesting the screen "${screenOrSelector}" into "${acc.screen}", that makes no sense? :-)`
          );
        }
        acc.screen = screenOrSelector;
        return acc;
      }
      // Normal css nesting selector:
      acc.nestingPath +=
        screenOrSelector[0] === "&"
          ? screenOrSelector.substring(1)
          : ` ${screenOrSelector}`;

      return acc;
    },
    { screen: MAIN_SCREEN_ID, nestingPath: "" }
  );

const hyphenAndVendorPrefixCssProp = (
  cssProp: string,
  vendorProps: any[],
  vendorPrefix: string
) => {
  const isVendorPrefixed = cssProp[0] === cssProp[0].toUpperCase();
  let cssHyphenProp = cssProp
    .split(/(?=[A-Z])/)
    .map((g) => g.toLowerCase())
    .join("-");

  if (isVendorPrefixed) {
    cssHyphenProp = `-${cssHyphenProp}`;
  } else if (vendorProps.includes(`${vendorPrefix}${cssHyphenProp}`)) {
    cssHyphenProp = `${vendorPrefix}${cssHyphenProp}`;
  }
  return cssHyphenProp;
};

const toStringCachedAtom = function (this: IAtom) {
  return this._className!;
};

const toStringCompose = function (this: IComposedAtom) {
  const className = this.atoms.map((atom) => atom.toString()).join(" ");

  // cache the className on this instance
  // @ts-ignore
  this._className = className;
  // @ts-ignore
  this.toString = toStringCachedAtom;
  return className;
};

const createToString = (
  sheets: { [screen: string]: ISheet },
  screens: IScreens = {},
  cssClassnameProvider: (atom: IAtom, seq: number | null) => [string, string?], // [className, pseudo]
  preInjectedRules: Set<string>
) => {
  let seq = 0;
  return function toString(this: IAtom) {
    const className = cssClassnameProvider(
      this,
      preInjectedRules.size ? null : seq++
    );
    const shouldInject =
      !preInjectedRules.size || !preInjectedRules.has(`.${className[0]}`);
    const value = this.value;

    if (shouldInject) {
      let cssRule = "";
      if (className.length === 2) {
        cssRule = `.${className[0]}${className[1]}{${this.cssHyphenProp}:${value};}`;
      } else {
        cssRule = `.${className[0]}{${this.cssHyphenProp}:${value};}`;
      }

      sheets[this.screen].insertRule(
        this.screen ? screens[this.screen](cssRule) : cssRule
      );
    }

    // We are switching this atom from IAtom simpler representation
    // 1. delete everything but `id` for specificity check

    // @ts-ignore
    this.cssHyphenProp = this.value = this.pseudo = this.screen = undefined;

    // 2. put on a _className
    this._className = className[0];

    // 3. switch from this `toString` to a much simpler one
    this.toString = toStringCachedAtom;

    return className[0];
  };
};

const createServerToString = (
  sheets: { [screen: string]: ISheet },
  screens: IScreens = {},
  cssClassnameProvider: (atom: IAtom, seq: number | null) => [string, string?] // [className, pseudo]
) => {
  return function toString(this: IAtom) {
    const className = cssClassnameProvider(this, null);
    const value = this.value;

    let cssRule = "";
    if (className.length === 2) {
      cssRule = `.${className[0]}${className[1]}{${this.cssHyphenProp}:${value};}`;
    } else {
      cssRule = `.${className[0]}{${this.cssHyphenProp}:${value};}`;
    }

    sheets[this.screen].insertRule(
      this.screen ? screens[this.screen](cssRule) : cssRule
    );

    // We do not clean out the atom here, cause it will be reused
    // to inject multiple times for each request

    // 1. put on a _className
    this._className = className[0];

    // 2. switch from this `toString` to a much simpler one
    this.toString = toStringCachedAtom;

    return className[0];
  };
};

const createThemeToString = (classPrefix: string, variablesSheet: ISheet) =>
  function toString(this: IThemeAtom) {
    const themeClassName = `${classPrefix ? `${classPrefix}-` : ""}theme-${
      this.name
    }`;

    // @ts-ignore
    variablesSheet.insertRule(
      `.${themeClassName}{${Object.keys(this.definition).reduce(
        (aggr, tokenType) => {
          // @ts-ignore
          return `${aggr}${Object.keys(this.definition[tokenType]).reduce(
            (subAggr, tokenKey) => {
              // @ts-ignore
              return `${subAggr}--${tokenType}-${tokenKey}:${this.definition[tokenType][tokenKey]};`;
            },
            aggr
          )}`;
        },
        ""
      )}}`
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

const composeIntoMap = (
  map: Map<string, IAtom>,
  atoms: (IAtom | IComposedAtom)[]
) => {
  let i = atoms.length - 1;
  for (; i >= 0; i--) {
    const item = atoms[i];
    // atoms can be undefined, null, false or '' using ternary like
    // expressions with the properties
    if (item && item[ATOM] && "atoms" in item) {
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

export const createTokens = <T extends ITokensDefinition>(tokens: T) => {
  return tokens;
};

export const createCss = <T extends IConfig>(
  config: T,
  env: Window | null = typeof window === "undefined" ? null : window
): TCss<T> => {
  const showFriendlyClassnames =
    typeof config.showFriendlyClassnames === "boolean"
      ? config.showFriendlyClassnames
      : process.env.NODE_ENV === "development";
  const prefix = config.prefix || "";
  const { vendorPrefix, vendorProps } = env
    ? getVendorPrefixAndProps(env)
    : { vendorPrefix: "-node-", vendorProps: [] };

  if (env && hotReloadingCache.has(prefix)) {
    const instance = hotReloadingCache.get(prefix);
    instance.dispose();
  }

  // pre-compute class prefix
  const classPrefix = prefix
    ? showFriendlyClassnames
      ? `${prefix}_`
      : prefix
    : "";
  const cssClassnameProvider = (
    atom: IAtom,
    seq: number | null
  ): [string, string?] => {
    const hash =
      seq === null
        ? hashString(
            `${atom.screen || ""}${atom.cssHyphenProp.replace(
              /-(moz|webkit|ms)-/,
              ""
            )}${atom.pseudo || ""}${atom.value}`
          )
        : seq;
    const name = showFriendlyClassnames
      ? `${atom.screen ? `${atom.screen}_` : ""}${atom.cssHyphenProp
          .replace(/-(moz|webkit|ms)-/, "")
          .split("-")
          .map((part) => part[0])
          .join("")}_${hash}`
      : `_${hash}`;
    const className = `${classPrefix}${name}`;

    if (atom.pseudo) {
      return [className, atom.pseudo];
    }

    return [className];
  };

  const { tags, sheets } = createSheets(env, config.screens);
  const preInjectedRules = new Set<string>();
  // tslint:disable-next-line
  for (const sheet in sheets) {
    for (let x = 0; x < sheets[sheet].cssRules.length; x++) {
      preInjectedRules.add(sheets[sheet].cssRules[x].selectorText);
    }
  }

  let toString = env
    ? createToString(
        sheets,
        config.screens,
        cssClassnameProvider,
        preInjectedRules
      )
    : createServerToString(sheets, config.screens, cssClassnameProvider);

  let themeToString = createThemeToString(classPrefix, sheets.__variables__);
  let keyframesToString = createKeyframesToString(sheets[MAIN_SCREEN_ID]);
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
    screen = MAIN_SCREEN_ID,
    pseudo?: string
  ) => {
    let tokenValue: any = resolveTokens(cssProp, value, tokens);

    // generate id used for specificity check
    // two atoms are considered equal in regared to there specificity if the id is equal
    const id =
      cssProp.toLowerCase() +
      (pseudo ? pseudo.split(":").sort().join(":") : "") +
      screen;

    // make a uid accouting for different values
    const uid = id + value;

    // If this was created before return the cached atom
    if (atomCache.has(uid)) {
      return atomCache.get(uid)!;
    }

    // prepare the cssProp
    let cssHyphenProp = hyphenAndVendorPrefixCssProp(
      cssProp,
      vendorProps,
      vendorPrefix
    );

    // Create a new atom
    const atom: IAtom = {
      id,
      cssHyphenProp,
      value: tokenValue,
      pseudo,
      screen,
      toString,
      [ATOM]: true,
    };

    // Cache it
    atomCache.set(uid, atom);

    return atom;
  };

  // pre-checked config to avoid checking these all the time
  // TODO: handle defaults better
  const screens = (config.screens = config.screens || {});
  const utils = (config.utils = config.utils || {});
  const tokens = (config.tokens = config.tokens || {});

  let baseTokens = ":root{";
  // tslint:disable-next-line
  for (const tokenType in tokens) {
    // @ts-ignore
    // tslint:disable-next-line
    for (const token in tokens[tokenType]) {
      const cssvar = `--${tokenType}-${token}`;

      // @ts-ignore
      baseTokens += `${cssvar}:${tokens[tokenType][token]};`;

      // @ts-ignore
      tokens[tokenType][token] = `var(${cssvar})`;
    }
  }
  baseTokens += "}";

  if (!preInjectedRules.has(":root")) {
    sheets.__variables__.insertRule(baseTokens);
  }

  // atom cache
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
      if (typeof definitions[x] === "string" || definitions[x][ATOM]) {
        args[index++] = definitions[x];
      } else {
        resolveStyleObj(definitions[x], config, (prop, value, path) => {
          const { nestingPath, screen } = resolveScreenAndSelector(
            path,
            config
          );
          args[index++] = createAtom(prop, value, screen, nestingPath);
        });
      }
    }

    return compose(...args);
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

  cssInstance.keyframes = (definition: any): IKeyframesAtom => {
    let cssRule = "";
    let currentTimeProp = "";
    resolveStyleObj(definition, config, (key, value, [timeProp]) => {
      if (timeProp !== currentTimeProp) {
        if (cssRule) {
          cssRule += `}`;
        }
        currentTimeProp = timeProp;
        cssRule += `${timeProp} {`;
      }
      cssRule += `${hyphenAndVendorPrefixCssProp(
        key,
        vendorProps,
        vendorPrefix
      )}: ${resolveTokens(key, value, tokens)};`;
    });

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
      sheets[sheet].content = "";
    }
    if (baseTokens) {
      sheets.__variables__.insertRule(baseTokens);
    }

    // We have to reset our toStrings so that they will now inject again,
    // and still cache is it is being reused
    toString = createServerToString(
      sheets,
      config.screens,
      cssClassnameProvider
    );
    keyframesToString = createKeyframesToString(sheets[MAIN_SCREEN_ID]);
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
      styles: Object.keys(screens).reduce(
        (aggr, key) => {
          return aggr.concat(`/* STITCHES:${key} */\n${sheets[key].content}`);
        },
        [
          `/* STITCHES:__variables__ */\n${sheets.__variables__.content}`,
          `/* STITCHES */\n${sheets[""].content}`,
        ]
      ),
    };
  };

  if (env) {
    hotReloadingCache.set(prefix, cssInstance);
  }

  return cssInstance;
};
