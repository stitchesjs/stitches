export const hasNames = (target) => {
	for (const name in target) return true
	return false
}
