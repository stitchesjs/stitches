/* Symbol
/* ========================================================================== */

/** Applies a Symbol (S) key and value (V) to a type (B). */
declare type WithSymbol<T extends any, S extends symbol, V extends any> = T & { [K in S]: V }
