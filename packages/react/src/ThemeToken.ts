class ThemeToken extends String {
	get computedValue() {
		return 'var(' + this.variable + ')'
	}

	get variable() {
		return '--' + this.scale + '-' + this.token
	}

	toString() {
		return this.computedValue
	}

	scale!: string
	token!: string
}

export default ThemeToken
