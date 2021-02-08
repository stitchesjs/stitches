import { from } from './Array.js'

/** Collection of unique CSS values and other sets of CSS. */
class CssSet extends Set {
	constructor(onChange) {
		super().onChange = onChange
	}

	/** Returns a combined string of all the elements of the set, conditionally running an onChange event. */
	addCss(item) {
		if (
			// if the item has yet to be added; and,
			!this.has(item)
			// if an onchange event exists on the set; and,
			&& this.add(item).onChange
			// if the item contributed a meaningful string
			&& String(item)
		) this.onChange(this)

		return this
	}

	/** Returns a combined string of all the elements of the set. */
	toString() {
		return from(this).join('')
	}
}

export default CssSet
