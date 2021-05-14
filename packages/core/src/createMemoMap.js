const stringifyReplacer = (name, data) => (typeof data === 'function' ? { '()': Function.prototype.toString.call(data) } : data)

const stringify = (value) => JSON.stringify(value, stringifyReplacer)

/** @type {() => <T = any, A = any[], F = (T, ...A) => any>(value: T, apply: F, ...args: A) => ReturnType<F>} */
export const createMemoMap = () => {
	const cache = Object.create(null)

	return (value, apply, ...args) => {
		const vjson = stringify(value)

		return vjson in cache ? cache[vjson] : (cache[vjson] = apply(value, ...args))
	}
}
