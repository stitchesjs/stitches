/** Object whose property names are the hashes and whose values are CSS. */
const CssHash = Object.create(null)

CssHash[Symbol.toPrimitive] = function () {
	return Object.values(this).join('')
}

export default CssHash
