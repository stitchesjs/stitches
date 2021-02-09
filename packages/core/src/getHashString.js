/** Returns a unique hash for an object. */
export default (
	/** Hash prefix. */
	prefix,
	/** Hashable object. */
	object,
) => {
	for (var value = JSON.stringify(object), index = value.length, hash = 9; index; ) {
		hash = Math.imul(hash ^ value.charCodeAt(--index), 9 ** 9)
	}

	return prefix + (hash ^ (hash >>> 9)).toString(36).slice(-5)
}
