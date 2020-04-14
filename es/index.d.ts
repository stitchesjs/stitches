import { IConfig, TCss, TTokensDefinition } from "./types";
export declare const createConfig: <T extends IConfig>(config: T) => T;
export declare const createTokens: <T extends TTokensDefinition>(tokens: T) => T;
export declare const createCss: <T extends IConfig>(config: T, env?: Window | null) => TCss<T>;
