/** Returns the given value converted to camel-case. */
export const toCamelCase = (/** @type {string} */ value) => (!/[A-Z]/.test(value) ? value.replace(/-[^]/g, (capital) => capital[1].toUpperCase()) : value)
