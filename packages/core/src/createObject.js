/** @type {<T>(target: T, source: any) => T} */
export const createObject = (target, source) => Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
