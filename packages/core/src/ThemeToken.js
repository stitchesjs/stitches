import { toTailDashed } from './convert/toTailDashed.js'

export class ThemeToken {
	constructor(name, value, scale, prefix) {
		this.name = name == null ? '' : String(name)
		this.value = value == null ? '' : String(value)
		this.scale = scale == null ? '' : String(scale)
		this.prefix = prefix == null ? '' : String(prefix)
	}

	get computedValue() {
		return 'var(' + this.variable + ')'
	}

	get variable() {
		return '--' + toTailDashed(this.prefix) + toTailDashed(this.scale) + this.name
	}

	toString() {
		return this.computedValue
	}
}
