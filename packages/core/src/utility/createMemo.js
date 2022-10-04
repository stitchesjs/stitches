const stringifyReplacer = (name, data) => (typeof data === 'function' ? { '()': Function.prototype.toString.call(data) } : data)

const stringify = (value) => JSON.stringify(value, stringifyReplacer)


export const createMemo = () => {
	const cache = Object.create(null)

	return (value, apply, ...args) => {
		const vjson = stringify(value)

		return vjson in cache ? cache[vjson] : (cache[vjson] = apply(value, ...args))
	}
}
