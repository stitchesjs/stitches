import { toPrimitive } from './Symbol.js'
import { from } from '../../stringify/src/Array.js'

export default class StringSet extends Set {
	toString() {
		return from(this).join('')
	}

	get hasChanged() {
		const { size } = this

		return () => size < this.size
	}
}

StringSet.prototype[toPrimitive] = StringSet.prototype.toString
