/** Returns a unique hash for an object. */
export default () => {
	let hashSet = new Set()

	return (
		/** Hash prefix. */
		prefix,
		/** Hashable object. */
		object,
	) => {
		/** @see https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480?#comment115384813_52171480 */
		for (var value = JSON.stringify(object), index = value.length, hash = 9; index; ) {
			hash = Math.imul(hash ^ value.charCodeAt(--index), 9 ** 9)
		}

		while (hashSet.has(hash)) ++hash

		hashSet.add(hash)

		return prefix + (hash ^ (hash >>> 9)).toString(36).slice(-5)
	}
}
