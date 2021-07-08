import { toTailDashed } from './convert/toTailDashed.js'

/** @type {import('../types/theme').Token} */
export class ThemeToken {
	constructor(token, value, scale, prefix) {
		this.token = token == null ? '' : String(token)
		this.value = value == null ? '' : String(value)
		this.scale = scale == null ? '' : String(scale)
		this.prefix = prefix == null ? '' : String(prefix)
	}

	get computedValue() {
		return 'var(' + this.variable + ')'
	}

	get variable() {
		return '--' + toTailDashed(this.prefix) + toTailDashed(this.scale) + this.token
	}

	toString() {
		return this.computedValue
	}
}
