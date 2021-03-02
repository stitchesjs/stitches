export default (objectA, objectB) => {
	for (var n in objectB) {
		var objectBN = objectB[n]
		if (objectBN === Object(objectBN)) {
			var objectAN = objectA[n]
			if (objectAN === Object(objectAN)) {
				objectA[n] = deepMerge(objectAN, objectBN)
				continue
			}
		}
		objectA[n] = objectBN
	}
	return objectA
}
