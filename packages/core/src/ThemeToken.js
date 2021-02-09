/** CSS token value, name, and scale. */
class ThemeToken {
	constructor(value, token, scale) {
		this.value = value
		this.token = token
		this.scale = scale
	}

	/** Returns a serialized CSS var() representing the token. */
	get computedValue() {
		return 'var(' + this.variable + ')'
	}

	/** Returns a serialized name representing the token. */
	get variable() {
		return '--' + this.scale + '-' + this.token
	}

	/** Returns a serialized CSS var() representing the token. */
	toString() {
		return this.computedValue
	}
}

export default ThemeToken
