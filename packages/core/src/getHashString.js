/** Returns a unique constant hash for an object. */
const getHashString = (
	/** Object to be hashed. */
	object,
) => {
	for (var value = JSON.stringify(object), index = value.length, hash = 9; index;) {
		hash = Math.imul(hash ^ value.charCodeAt(--index), 9 ** 9)
	}

	return 's' + (hash ^ (hash >>> 9)).toString(36)
}

export default getHashString
