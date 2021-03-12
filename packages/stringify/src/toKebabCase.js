// prettier-ignore

/** Returns the given value converted to kebab-case. */
export const toKebabCase = (/** @type {string} */ value) => (
	// ignore kebab-like values
	/-/.test(value)
		? value
	// replace any upper-case letter with a dash and the lower-case variant
	: value.replace(/[A-Z]/g, (capital) => '-' + capital.toLowerCase())
)
