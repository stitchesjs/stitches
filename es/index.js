import { createSheets, cssPropToToken } from "./utils";
var noop = function () { };
var cssClassname = function (cssProp, value, pseudo, screen) {
    var className = "" + (screen ? screen + "_" : "") + cssProp + "_" + String(value) + (pseudo ? pseudo.replace(/:/g, "_") : "");
    if (pseudo) {
        return { className: className, pseudo: pseudo };
    }
    return className;
};
var toCssProp = function (cssPropParts) {
    return cssPropParts.join("-");
};
var createToString = function (sheets, screens) {
    if (screens === void 0) { screens = {}; }
    return function toString() {
        // This was a composition
        if ("atoms" in this) {
            return this.atoms.map(function (atom) { return atom.toString(); }).join(" ");
        }
        // plain atom
        var className = cssClassname(toCssProp(this.cssPropParts), this.value, this.pseudo, this.screen);
        var cssProp = toCssProp(this.cssPropParts);
        var value = this.tokenValue || this.value;
        var cssRule = ".";
        if (typeof className === "string") {
            cssRule += className + "{" + cssProp + ":" + value + ";}";
        }
        else {
            cssRule += "" + className.className + className.pseudo + "{" + cssProp + ":" + value + ";}";
        }
        sheets[this.screen].insertRule(this.screen ? screens[this.screen](cssRule) : cssRule);
        return typeof className === "string" ? className : className.className;
    };
};
var composeIntoMap = function (map, atoms) {
    var i = atoms.length - 1;
    for (; i >= 0; i--) {
        var item = atoms[i];
        if ("atoms" in item) {
            composeIntoMap(map, item.atoms);
        }
        else {
            if (!map.has(item.id)) {
                map.set(item.id, item);
            }
        }
    }
};
export var createConfig = function (config) {
    return config;
};
export var createTokens = function (tokens) {
    return tokens;
};
export var createCss = function (config, env) {
    if (env === void 0) { env = window; }
    var cssProp;
    var screen;
    // We need to know when we call utils to avoid clearing
    // the screen set for that util
    var isCallingUtil = false;
    var sheets = createSheets(env, config.screens);
    var toString = createToString(sheets, config.screens);
    var compose = function () {
        var atoms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            atoms[_i] = arguments[_i];
        }
        var map = new Map();
        composeIntoMap(map, atoms);
        return {
            atoms: Array.from(map.values()),
            toString: toString,
        };
    };
    return new Proxy(noop, {
        get: function (_, prop, proxy) {
            if (prop === "compose") {
                return compose;
            }
            // SSR
            if (prop === "getStyles") {
                return function () {
                    return Object.keys(config.screens || {}).reduce(function (aggr, key) {
                        return aggr + sheets[key].content;
                    }, sheets[""].content);
                };
            }
            if (config.screens && prop in config.screens) {
                screen = String(prop);
            }
            else if (config.utils && cssProp in config.utils) {
                var util_1 = config.utils[String(prop)](proxy);
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    isCallingUtil = true;
                    var result = util_1.apply(void 0, args);
                    isCallingUtil = false;
                    screen = undefined;
                    return result;
                };
            }
            else {
                cssProp = String(prop);
            }
            return proxy;
        },
        apply: function (_, __, argsList) {
            var cssPropParts = cssProp
                .split(/(?=[A-Z])/)
                .map(function (g) { return g.toLowerCase(); });
            var value = argsList[0];
            var pseudo = argsList[1];
            var token = config.tokens &&
                config.tokens[cssPropToToken[cssProp]];
            var tokenValue;
            if (token) {
                tokenValue = token[value];
            }
            var atom = {
                id: cssPropParts
                    .concat(pseudo ? pseudo.split(":").sort().join(":") : "")
                    .concat(screen || "")
                    .join(""),
                cssPropParts: cssPropParts,
                value: value,
                pseudo: pseudo,
                screen: screen || "",
                tokenValue: tokenValue,
                toString: toString,
            };
            if (!isCallingUtil) {
                screen = undefined;
            }
            return atom;
        },
    });
};
//# sourceMappingURL=index.js.map