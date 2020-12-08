/** Returns CSS text resolved from mixed properties. */
const getResolvedTheme = (
	/** Theme of scales and tokens (e.g. `{ colors: { brand: "tomato" } }`). */
	theme: any,
	/** Nested selectors (e.g. `["&:hover", "&:focus"]`). */
	selectorials: string[] = [':root'],
) => {
	let cssText = ''

	for (const scale in theme) {
		const tokens = theme[scale]

		for (const prop in tokens) {
			const data = tokens[prop]

			cssText += `--${scale}-${prop}:${data};`
		}
	}

	if (cssText) cssText = `${selectorials.join(',')}{${cssText}}`

	return cssText
}

export default getResolvedTheme
