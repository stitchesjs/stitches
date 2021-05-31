const seed = 5381

const phash = (/** @type {number} */ h, /** @type {string} */ x) => {
	let i = x.length
	while (i) h = (h * 33) ^ x.charCodeAt(--i)
	return h
}

const hash = (/** @type {string} */ value) => phash(seed, value)

const charsLength = 52

const getAlphabeticChar = (/** @type {number} */ code) => String.fromCharCode(code + (code > 25 ? 39 : 97))

const generateAlphabeticName = (/** @type {number} */ code) => {
	let name = ''
	let x
	for (x = Math.abs(code); x > charsLength; x = (x / charsLength) | 0) {
		name = getAlphabeticChar(x % charsLength) + name
	}
	return getAlphabeticChar(x % charsLength) + name
}

export const createComponentId = (/** @type {string} */ value) => generateAlphabeticName(hash(JSON.stringify(value)) >>> 0)
