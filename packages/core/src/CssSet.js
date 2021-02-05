import { from } from './Array.js'

class CssSet extends Set {
	constructor(onChange) {
		super().onChange = onChange
	}

	set(item) {
		if (!this.has(item)) {
			this.add(item)

			if (this.onChange && String(item)) {
				this.onChange(this)
			}
		}
	}

	toString() {
		return from(this).join('')
	}
}

export default CssSet
