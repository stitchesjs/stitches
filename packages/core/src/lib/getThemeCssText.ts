const getThemeCssText = (theme: Theme) => {
	let cssText = ''
	for (const scaleName in theme) {
		const scale = Object(theme[scaleName])
		for (const prop in scale) {
			cssText += `\t--${scaleName}-${prop}: ${scale[prop]};\n`
		}
	}
	if (cssText) cssText = `\n:root {\n${cssText}}\n`
	return cssText
}

export default getThemeCssText
