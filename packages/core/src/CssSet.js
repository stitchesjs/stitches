import { from } from './Array.js'

class CssSet extends Set {
	constructor(onChange) {
		super().onChange = onChange
	}

	add(item) {
		const { onChange, size } = this

		super.add.call(this, item)

		if (onChange && this.size !== size) onChange(this)
	}

	toString() {
		return from(this).join('')
	}
}

export default CssSet
