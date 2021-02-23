const color = new Proxy(
	Object.entries({
		reset: 0,
		bold: 1,
		dim: 2,
		underline: 4,
		blink: 5,
		invert: 7,
		hidden: 8,
		black: 30,
		red: 31,
		green: 32,
		yellow: 33,
		blue: 34,
		magenta: 35,
		cyan: 36,
		white: 37,
		bgBlack: 40,
		bgRed: 41,
		bgGreen: 42,
		bgYellow: 43,
		bgBlue: 44,
		bgMagenta: 45,
		bgCyan: 46,
		bgWhite: 47,
	}).reduce((color, [name, id]) => ({ ...color, [name]: `\x1b[${id}m` }), {}),
	{
		get: (colors, name) => (string) => colors[name] + string.replaceAll(colors.reset, colors.reset + colors[name]) + colors.reset,
	},
)

export default color
