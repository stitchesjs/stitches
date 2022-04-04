/** Returns the given value converted to kebab-case. */
export const toKebabCase = (/** @type {string} */ value) =>
	// ignore kebab-like values
	value.includes('-')
		? value
		: // replace any upper-case letter with a dash and the lower-case variant
		  value.replace(/[A-Z]/g, (capital) => '-' + capital.toLowerCase())

/** Returns the given value converted to camel-case. */
export const toCamelCase = (/** @type {string} */ value) => (!/[A-Z]/.test(value) ? value.replace(/-[^]/g, (capital) => capital[1].toUpperCase()) : value)
