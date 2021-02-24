/** Return an object of custom property styles from an object representing themed token values. */
const getCustomProperties = (
	/** Object representing themed token values. */
	theme,
) => {
	/** Object of custom property styles. */
	const styles = {}

	for (const scaleName in theme) {
		for (const tokenName in theme[scaleName]) {
			styles['$' + scaleName + '-' + tokenName] = String(theme[scaleName][tokenName]).replace(/\$[$\w-]+/g, ($1) => (/[^]\$/.test($1) ? $1 : '$' + scaleName + $1))
		}
	}

	return styles
}

export default getCustomProperties
