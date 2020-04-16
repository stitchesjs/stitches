import {
  IAtom,
  IComposedAtom,
  IConfig,
  ICssPropToToken,
  IScreens,
  ISheet,
  ITokensDefinition,
  TCss,
} from "./types";
import { addDefaultUtils, createSheets, cssPropToToken } from "./utils";

export * from "./types";

// tslint:disable-next-line: no-empty
const noop = () => {};
export const prefixes = new Set<string>();
const cssClassname = (seq: number, atom: IAtom) => {
  const className = `${atom.prefix ? `${atom.prefix}_` : ""}${
    atom.screen ? `${atom.screen}_` : ""
  }${atom.cssPropParts.map((part) => part[0]).join("")}_${String(seq)}`;

  if (atom.pseudo) {
    return { className, pseudo: atom.pseudo };
  }

  return className;
};

const toCssProp = (cssPropParts: string[]) => {
  return cssPropParts.join("-");
};

const createToString = (
  insertedClassnames: Map<string, string>,
  sheets: { [screen: string]: ISheet },
  screens: IScreens = {}
) => {
  let seq = 0;
  return function toString(this: IComposedAtom | IAtom) {
    // This was a composition
    if ("atoms" in this) {
      return this.atoms.map((atom) => atom.toString()).join(" ");
    }

    if (insertedClassnames.has(this.uid)) {
      return insertedClassnames.get(this.uid)!;
    }

    // plain atom
    const className = cssClassname(seq++, this);
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

    const result =
      typeof className === "string" ? className : className.className;

    insertedClassnames.set(this.uid, result);

    return result;
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

export const createCss = <T extends IConfig>(
  config: T,
  env: Window | null = typeof window === "undefined" ? null : window
): TCss<T> => {
  const prefix = config.prefix || "";

  if (prefixes.has(prefix)) {
    throw new Error(`@stitches/css - The prefix "${prefix}" is already in use`);
  }

  prefixes.add(prefix);

  let cssProp: string;
  let screen: string | undefined;
  // We need to know when we call utils to avoid clearing
  // the screen set for that util
  let isCallingUtil = false;
  const sheets = createSheets(env, config.screens);
  const insertedClassnames = new Map<string, string>();
  const toString = createToString(insertedClassnames, sheets, config.screens);
  const compose = (...atoms: IAtom[]): IComposedAtom => {
    const map = new Map<string, IAtom>();
    composeIntoMap(map, atoms);
    return {
      atoms: Array.from(map.values()),
      toString,
    };
  };

  addDefaultUtils(config);

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
      } else if (config.utils && prop in config.utils) {
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

      const id = cssPropParts
        .concat(pseudo ? pseudo.split(":").sort().join(":") : "")
        .concat(screen || "")
        .join("");

      const atom: IAtom = {
        id,
        uid: id + value,
        cssPropParts,
        value,
        pseudo,
        screen: screen || "",
        tokenValue,
        toString,
        prefix,
      };

      if (!isCallingUtil) {
        screen = undefined;
      }

      return atom;
    },
  }) as any;
};

// default instance
export const css = createCss({
  prefix: "di",
});
