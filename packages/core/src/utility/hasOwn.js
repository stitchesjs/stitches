const { hasOwnProperty } = Object.prototype

/** @type {<T extends object = { [key: string]: any }, K extends string = string>(target: T, key: K) => K extends keyof T ? true : false} */
export const hasOwn = (target, key) => hasOwnProperty.call(target, key)
