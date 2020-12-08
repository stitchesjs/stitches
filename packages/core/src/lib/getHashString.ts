const getHashString = (value: string) => {
	for (var i = value.length, h = 9; i; ) h = Math.imul(h ^ value.charCodeAt(--i), 9 ** 9)
	return 's' + (h ^ (h >>> 9)).toString(36)
}

export default getHashString
