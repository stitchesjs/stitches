/** Returns a unique hash for an value. */
export const toHash = (
	/** @type {string} Hashable value. */
	value,
) => {
	/** @see https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480?#comment115384813_52171480 */
	for (var index = value.length, hash = 9; index; ) {
		hash = Math.imul(hash ^ value.charCodeAt(--index), 9 ** 9)
	}

	const hashString = (hash ^ (hash >>> 9)).toString(36).slice(-5)

	return hashString
}
