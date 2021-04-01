/** CSS token value, name, and scale. */
class ThemeToken {
	constructor(value, token, scale, commonHash) {
		this.value = value
		this.token = token
		this.scale = scale
		this.commonHash = commonHash
	}

	/** Returns a serialized CSS var() representing the token. */
	get computedValue() {
		return 'var(' + this.variable + ')'
	}

	/** Returns a serialized name representing the token. */
	get variable() {
		return '--' + this.scale + '-' + this.token + this.commonHash
	}

	/** Returns a serialized CSS var() representing the token. */
	toString() {
		return this.computedValue
	}
}

export default ThemeToken
