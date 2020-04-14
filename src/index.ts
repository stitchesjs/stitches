import {
  IAtom,
  IComposedAtom,
  IConfig,
  ICssPropToToken,
  ISheet,
  TCss,
  TTokensDefinition,
  IScreens,
} from "./types";
import { createSheets, cssPropToToken } from "./utils";

const noop = () => {};
const cssClassname = (
  cssProp: string,
  value: string | number,
  pseudo?: string,
  screen?: string
) => {
  const className = `${screen ? `${screen}_` : ""}${cssProp}_${String(value)}${
    pseudo ? pseudo.replace(/:/g, "_") : ""
  }`;

  if (pseudo) {
    return { className, pseudo };
  }

  return className;
};

const toCssProp = (cssPropParts: string[]) => {
  return cssPropParts.join("-");
};

const createToString = (
  sheets: { [screen: string]: ISheet },
  screens: IScreens = {}
) =>
  function toString(this: IComposedAtom | IAtom) {
    // This was a composition
    if ("atoms" in this) {
      return this.atoms.map((atom) => atom.toString()).join(" ");
    }
    // plain atom
    const className = cssClassname(
      toCssProp(this.cssPropParts),
      this.value,
      this.pseudo,
      this.screen
    );
    const cssProp = toCssProp(this.cssPropParts);
    const value = this.tokenValue || this.value;
    let cssRule = ".";

    if (typeof className === "string") {
      cssRule += `${className}{${cssProp}:${value};}`;
    } else {
      cssRule += `${className.className}${className.pseudo}{${cssProp}:${value};}`;
    }

    sheets[this.screen].insertRule(
      this.screen ? screens[this.screen](cssRule) : cssRule
    );

    return typeof className === "string" ? className : className.className;
  };

const composeIntoMap = (
  map: Map<string, IAtom>,
  atoms: (IAtom | IComposedAtom)[]
) => {
  let i = atoms.length - 1;
  for (; i >= 0; i--) {
    const item = atoms[i];
    if ("atoms" in item) {
      composeIntoMap(map, item.atoms);
    } else {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }
  }
};

export const createConfig = <T extends IConfig>(config: T) => {
  return config;
};

export const createTokens = <T extends TTokensDefinition>(tokens: T) => {
  return tokens;
};

export const createCss = <T extends IConfig>(
  config: T,
  env: Window | null = window
): TCss<T> => {
  let cssProp: string;
  let screen: string | undefined;
  // We need to know when we call utils to avoid clearing
  // the screen set for that util
  let isCallingUtil = false;
  const sheets = createSheets(env, config.screens);
  const toString = createToString(sheets, config.screens);
  const compose = (...atoms: IAtom[]): IComposedAtom => {
    const map = new Map<string, IAtom>();
    composeIntoMap(map, atoms);
    return {
      atoms: Array.from(map.values()),
      toString,
    };
  };

  return new Proxy(noop, {
    get(_, prop, proxy) {
      if (prop === "compose") {
        return compose;
      }

      // SSR
      if (prop === "getStyles") {
        return () =>
          Object.keys(config.screens || {}).reduce((aggr, key) => {
            return aggr + sheets[key].content;
          }, sheets[""].content);
      }

      if (config.screens && prop in config.screens) {
        screen = String(prop);
      } else if (config.utils && cssProp in config.utils) {
        const util = config.utils[String(prop)](proxy);

        return (...args: any[]) => {
          isCallingUtil = true;
          const result = util(...args);
          isCallingUtil = false;
          screen = undefined;
          return result;
        };
      } else {
        cssProp = String(prop);
      }

      return proxy;
    },
    apply(_, __, argsList) {
      const cssPropParts = cssProp
        .split(/(?=[A-Z])/)
        .map((g) => g.toLowerCase());
      const value = argsList[0];
      const pseudo = argsList[1];
      const token =
        config.tokens &&
        config.tokens[cssPropToToken[cssProp as keyof ICssPropToToken]];
      let tokenValue: string | undefined;

      if (token) {
        tokenValue = token[value];
      }

      const atom: IAtom = {
        id: cssPropParts.concat(argsList).join(""),
        cssPropParts,
        value,
        pseudo,
        screen: screen || "",
        tokenValue,
        toString,
      };

      if (!isCallingUtil) {
        screen = undefined;
      }

      return atom;
    },
  }) as any;
};
