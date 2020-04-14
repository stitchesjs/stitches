import { ICssPropToToken, IScreens, ISheet } from "./types";
export declare const cssPropToToken: ICssPropToToken;
export declare const createSheets: (env: any, screens?: IScreens) => {
    [key: string]: ISheet;
};
