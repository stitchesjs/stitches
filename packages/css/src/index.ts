import {
  IAtom,
  IComposedAtom,
  IConfig,
  ICssPropToToken,
  IScreens,
  ISheet,
  IThemeAtom,
  ITokensDefinition,
  TCss,
  TDeclarativeCss,
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

export const createTokens = <T extends ITokensDefinition>(tokens: T) => {
  return tokens;
};

const createDeclarativeCss = <T extends IConfig>(
  config: T
): TDeclarativeCss<T> => {
  return function (this: any, definition: any) {
    const composer = this;
    const args: any[] = [];
    for (const key in definition) {
      if (config.utilityFirst && key === "override") {
        for (const overrideKey in definition[key]) {
          if (!overrideKey[0].match(/[a-z]/)) {
            // tslint:disable-next-line
            for (const selectorKey in definition[key][overrideKey]) {
              args.push(
                composer[key][selectorKey](
                  definition[key][overrideKey][selectorKey],
                  overrideKey
                )
              );
            }
          } else {
            args.push(composer[key][overrideKey](definition[key][overrideKey]));
          }
        }
      } else if (config.screens && key in config.screens) {
        for (const screenKey in definition[key]) {
          if (!screenKey[0].match(/[a-z]/)) {
            // tslint:disable-next-line
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
        // tslint:disable-next-line
        for (const selectorKey in definition[key]) {
          args.push(composer[selectorKey](definition[key][selectorKey], key));
        }
      } else {
        args.push(composer[key](definition[key]));
      }
    }

    return composer.compose(...args);
  } as any;
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
  const compose = (...atoms: IAtom[]): IComposedAtom => {
    const map = new Map<string, IAtom>();
    composeIntoMap(map, atoms);
    return {
      atoms: Array.from(map.values()),
      toString: toStringCompose,
    };
  };

  // pre-checked config to avoid checking these all the time
  const screens = config.screens || {};
  const utils = config.utils || {};
  const tokens = config.tokens || {};

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
  const themeCache = new Map<ITokensDefinition, IThemeAtom>();

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
      if (prop === "dispose") {
        return () => {
          atomCache.clear();
          tags.forEach((tag) => {
            tag.parentNode?.removeChild(tag);
          });
        };
      }
      if (prop === "_config") {
        return config;
      }
      if (prop === "theme") {
        return (definition: any): IThemeAtom => {
          if (themeCache.has(definition)) {
            return themeCache.get(definition)!;
          }

          const themeAtom = {
            // We could here also check if theme has been added from server,
            // though thinking it does not matter... just a simple rule
            name: String(themeCache.size),
            definition,
            toString: themeToString,
          };

          themeCache.set(definition, themeAtom);

          return themeAtom;
        };
      }
      if (prop === "compose") {
        return compose;
      }
      // SSR
      if (prop === "getStyles") {
        return (cb: any) => {
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

          // We have to reset our themeToStrings so that they will now inject again,
          // and still cache is it is being reused
          themeToString = createThemeToString(
            classPrefix,
            sheets.__variables__
          );

          atomCache.forEach((atom) => {
            atom.toString = toString;
          });

          themeCache.forEach((atom) => {
            atom.toString = themeToString;
          });

          const result = cb();

          return {
            result,
            styles: Object.keys(screens).reduce(
              (aggr, key) => {
                return aggr.concat(
                  `/* STITCHES:${key} */\n${sheets[key].content}`
                );
              },
              [
                `/* STITCHES:__variables__ */\n${sheets.__variables__.content}`,
                `/* STITCHES */\n${sheets[""].content}`,
              ]
            ),
          };
        };
      }

      if (prop === "override" && config.utilityFirst) {
        isOverriding = true;
        return proxy;
      }

      if (prop in screens) {
        if (screen) {
          throw new Error(
            `@stitches/css - You can not add the screen "${String(
              prop
            )}" inside the screen ${screen}`
          );
        }
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
        cssProp = "";
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
