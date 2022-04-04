/** @type {<T>(target: T, source: any) => T} */
export const define = (target, source) =>
	Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
