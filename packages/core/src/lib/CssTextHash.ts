const CssTextHash = Object.assign(Object.create(null), {
	[Symbol.toPrimitive]() {
		return Object.values(this).join('')
	},
})

export default CssTextHash
