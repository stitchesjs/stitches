import { toLeadDashed } from './convert/toDashed.js'

/** CSS token value, name, and scale. */
export class ThemeToken {
	/** @type {(value: string, token: string, scale: string, prefix: string) => void} */
	constructor(value, token, scale, prefix) {
		this.value = value
		this.token = token
		this.scale = scale
		this.prefix = prefix
	}

	/** Returns a serialized CSS var() representing the token. */
	get computedValue() {
		return 'var(' + this.variable + ')'
	}

	/** Returns a serialized name representing the token. */
	get variable() {
		return '-' + toLeadDashed(this.prefix) + toLeadDashed(this.scale) + '-' + this.token
	}

	/** Returns a serialized CSS var() representing the token. */
	toString() {
		return this.computedValue
	}
}
