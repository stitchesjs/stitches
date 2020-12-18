const getThemeAsCustomProperties = (init: Theme) => {
	const styles = {} as {
		[K in string]: number | string
	}

	for (const scaleName in init) {
		for (const tokenName in init[scaleName]) {
			styles['$' + scaleName + '-' + tokenName] = init[scaleName][tokenName]
		}
	}

	return styles
}

export default getThemeAsCustomProperties
