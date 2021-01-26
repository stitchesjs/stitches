/** Return an object of custom property styles from an object representing themed token values. */
const getCustomProperties = (
	/** @type {{ [key: string]: { [key: string]: number | string } }} Object representing themed token values. */
	theme,
) => {
	/** @type { [key: string]: boolean | number | string } Object of custom property styles. */
	const styles = {}

	for (const scaleName in theme) {
		for (const tokenName in theme[scaleName]) {
			styles['$' + scaleName + '-' + tokenName] = theme[scaleName][tokenName].replace(/\$[$-\w]+/g, ($1) => (/[^]\$/.test($1) ? $1 : '$' + scaleName + $1))
		}
	}

	return styles
}

export default getCustomProperties
