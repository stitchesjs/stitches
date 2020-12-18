/** Returns a unique and consistent hash of a stringified object. */
const getHashString = (source: any) => {
	for (var value = JSON.stringify(source), index = value.length, hash = 9; index; ) {
		hash = Math.imul(hash ^ value.charCodeAt(--index), 9 ** 9)
	}

	return 's' + (hash ^ (hash >>> 9)).toString(36)
}

export default getHashString
