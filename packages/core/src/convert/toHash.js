const toAlphabeticChar = (/** @type {number} */ code) => String.fromCharCode(code + (code > 25 ? 39 : 97))

const toAlphabeticName = (/** @type {number} */ code) => {
	let name = ''
	let x

	for (x = Math.abs(code); x > 52; x = (x / 52) | 0) name = toAlphabeticChar(x % 52) + name

	return toAlphabeticChar(x % 52) + name
}

const toPhash = (/** @type {number} */ h, /** @type {string} */ x) => {
	let i = x.length
	while (i) h = (h * 33) ^ x.charCodeAt(--i)
	return h
}

export const toHash = (/** @type {object} */ value) => toAlphabeticName(toPhash(5381, JSON.stringify(value)) >>> 0)
