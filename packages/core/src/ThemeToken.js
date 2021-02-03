class ThemeToken {
	constructor(value, token, scale) {
		this.value = value
		this.token = token
		this.scale = scale
	}

	get computedValue() {
		return 'var(' + this.variable + ')'
	}

	get variable() {
		return '--' + this.scale + '-' + this.token
	}

	toString() {
		return this.computedValue
	}
}

export default ThemeToken
