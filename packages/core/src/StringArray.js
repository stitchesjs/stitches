import { toPrimitive } from './Symbol.js'

export default class StringArray extends Array {
	toString() {
		return this.join('')
	}

	get hasChanged() {
		const cssText = String(this)

		return () => cssText !== String(this)
	}
}

StringArray.prototype[toPrimitive] = StringArray.prototype.toString
