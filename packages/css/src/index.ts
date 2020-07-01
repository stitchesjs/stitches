import {
  IAtom,
  IComposedAtom,
  IConfig,
  ICssPropToToken,
  IScreens,
  ISheet,
  ITokensDefinition,
  TCss,
  TDeclarativeCss,
} from "./types";
import {
  createSheets,
  cssPropToToken,
  getVendorPrefixAndProps,
  specificityProps,
} from "./utils";

export * from "./types";
export * from "./css-types";

// tslint:disable-next-line: no-empty
const noop = () => {};

export const hotReloadingCache = new Map<string, any>();

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
  cssClassnameProvider: (seq: number, atom: IAtom) => [string, string?], // [className, pseudo]
  startSeq = 0
) => {
  let seq = 0;
  return function toString(this: IAtom) {
    const shouldInject = seq >= startSeq;
    const className = cssClassnameProvider(seq++, this);
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

const composeIntoMap = (
  map: Map<string, IAtom>,
  atoms: (IAtom | IComposedAtom)[]
) => {
  let i = atoms.length - 1;
  for (; i >= 0; i--) {
    const item = atoms[i];
    // atoms can be undefined, null, false or '' using ternary like
    // expressions with the properties
    if (item && "atoms" in item) {
      composeIntoMap(map, item.atoms);
    } else if (item) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }
  }
};

export const createConfig = <T extends IConfig>(config: T) => {
  return config;
};

export const createTokens = <T extends ITokensDefinition>(tokens: T) => {
  return tokens;
};

export const createDeclarativeCss = <T extends IConfig>(
  config: T
): TDeclarativeCss<T> => {
  return function (this: any, definition: any) {
    const composer = this;
    const args: any[] = [];
    for (const key in definition) {
      if (config.screens && key in config.screens) {
        for (const screenKey in definition[key]) {
          if (!screenKey[0].match(/[a-z]/)) {
            for (const selectorKey in definition[key][screenKey]) {
              args.push(
                composer[key][selectorKey](
                  definition[key][screenKey][selectorKey],
                  screenKey
                )
              );
            }
          } else {
            args.push(composer[key][screenKey](definition[key][screenKey]));
          }
        }
      } else if (!key[0].match(/[a-z]/)) {
        for (const selectorKey in definition[key]) {
          args.push(composer[selectorKey](definition[key][selectorKey], key));
        }
      } else {
        args.push(composer[key](definition[key]));
      }
    }

    return css.compose(...args);
  } as any;
};

export const createCss = <T extends IConfig>(
  config: T,
  env: Window | null = typeof window === "undefined" ? null : window
): TCss<T> & TDeclarativeCss<T> => {
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
    instance.hotUpdateConfig(config);
    return instance;
  }

  // pre-compute class prefix
  const classPrefix = prefix
    ? showFriendlyClassnames
      ? `${prefix}_`
      : prefix
    : "";
  const cssClassnameProvider = (
    seq: number,
    atom: IAtom
  ): [string, string?] => {
    const name = showFriendlyClassnames
      ? `${atom.screen ? `${atom.screen}_` : ""}${atom.cssHyphenProp
          .split("-")
          .map((part) => part[0])
          .join("")}`
      : "";
    const className = `${classPrefix}${name}_${seq}`;

    if (atom.pseudo) {
      return [className, atom.pseudo];
    }

    return [className];
  };
  const sheets = createSheets(env, config.screens);
  const startSeq = Object.keys(sheets).reduce((count, key) => {
    // Can fail with cross origin (like Codesandbox)
    try {
      return count + sheets[key].cssRules.length;
    } catch {
      return count;
    }
  }, 0);
  const toString = createToString(
    sheets,
    config.screens,
    cssClassnameProvider,
    startSeq
  );
  const compose = (...atoms: IAtom[]): IComposedAtom => {
    const map = new Map<string, IAtom>();
    composeIntoMap(map, atoms);
    return {
      atoms: Array.from(map.values()),
      toString: toStringCompose,
    };
  };

  // pre-checked config to avoid checking these all the time
  let screens = config.screens || {};
  let utils = config.utils || {};
  let tokens = config.tokens || {};

  // atom cache
  const atomCache = new Map<string, IAtom>();

  // proxy state values that change based on propertie access
  let cssProp = "";
  let screen = "";
  // We need to know when we call utils to avoid clearing
  // the screen set for that util, also avoid util calling util
  // when overriding properties
  let isCallingUtil = false;
  // We need to know when we override as it does not require a util to
  // be called
  let isOverriding = false;
  const declarativeCss = createDeclarativeCss(config);
  const cssInstance = new Proxy(declarativeCss, {
    get(_, prop, proxy) {
      if (prop === "hotUpdateConfig") {
        return (newConfig: any) => {
          Object.assign(config, newConfig);
          atomCache.clear();
          screens = config.screens || {};
          utils = config.utils || {};
          tokens = config.tokens || {};
        };
      }
      if (prop === "compose") {
        return compose;
      }
      // SSR
      if (prop === "getStyles") {
        return () =>
          Object.keys(screens).reduce(
            (aggr, key) => {
              return aggr.concat(
                `/* STITCHES:${key} */\n${sheets[key].content}`
              );
            },
            [`/* STITCHES */\n${sheets[""].content}`]
          );
      }

      if (prop === "override" && config.utilityFirst) {
        isOverriding = true;
        return proxy;
      }

      if (prop in screens) {
        screen = String(prop);
      } else if (!isCallingUtil && prop in utils) {
        const util = utils[String(prop)](proxy, config);
        return (...args: any[]) => {
          isCallingUtil = true;
          const result = util(...args);
          isCallingUtil = false;
          screen = "";
          return result;
        };
      } else if (config.utilityFirst && !isCallingUtil && !isOverriding) {
        throw new Error(
          `@stitches/css - The property "${String(prop)}" is not available`
        );
      } else if (specificityProps[String(prop)]) {
        return specificityProps[String(prop)](cssInstance);
      } else {
        cssProp = String(prop);
      }

      return proxy;
    },
    apply(_, __, argsList) {
      if (!cssProp) {
        return _.call(cssInstance, argsList[0]);
      }
      const value = argsList[0];
      const pseudo = argsList[1];
      const token = tokens[cssPropToToken[cssProp as keyof ICssPropToToken]];
      const isVendorPrefixed = cssProp[0] === cssProp[0].toUpperCase();

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
        // Reset the screen name if needed
        if (!isCallingUtil) {
          screen = "";
        }
        return atomCache.get(uid)!;
      }

      // prepare the cssProp
      let cssHyphenProp = cssProp
        .split(/(?=[A-Z])/)
        .map((g) => g.toLowerCase())
        .join("-");

      if (isVendorPrefixed) {
        cssHyphenProp = `-${cssHyphenProp}`;
      } else if (vendorProps.includes(`${vendorPrefix}${cssHyphenProp}`)) {
        cssHyphenProp = `${vendorPrefix}${cssHyphenProp}`;
      }

      // Create a new atom
      const atom: IAtom = {
        id,
        cssHyphenProp,
        value: token && token[value] ? token[value] : value,
        pseudo,
        screen,
        toString,
      };

      // Cache it
      atomCache.set(uid, atom);

      // Reset the screen name
      if (!isCallingUtil) {
        screen = "";
      }

      isOverriding = false;
      cssProp = "";

      return atom;
    },
  }) as any;

  if (env) {
    hotReloadingCache.set(prefix, cssInstance);
  }

  return cssInstance;
};

// default instance
export const css = createCss({
  prefix: "di",
});
