import { safeJsonStringify } from './safeJsonStringify.js'

const stringifyReplacer = (name, data) => (typeof data === 'function' ? { '()': Function.prototype.toString.call(data) } : data)

/** @type {() => <T = any, A = any[], F = (T, ...A) => any>(value: T, apply: F, ...args: A) => ReturnType<F>} */
export const createMemo = () => {
	const cache = Object.create(null)

	return (value, apply, ...args) => {
		const vjson = safeJsonStringify(value, stringifyReplacer)

		return vjson in cache ? cache[vjson] : (cache[vjson] = apply(value, ...args))
	}
}
