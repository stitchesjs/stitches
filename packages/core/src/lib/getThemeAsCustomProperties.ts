const getThemeAsCustomProperties = (init: ThemeInit) => {
	const opts = Object(init) as Required<ThemeInit>

	const styles = {} as {
		[K in string]: number | string
	}

	let scaleName: keyof ThemeInit
	for (scaleName in opts) {
		for (const tokenName in opts[scaleName]) {
			styles['$' + scaleName + '-' + tokenName] = opts[scaleName][tokenName]
		}
	}

	return styles
}

export default getThemeAsCustomProperties
