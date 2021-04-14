const ansi = (id) => `\x1b[${id}m`
const escape = (string) => string.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')
const ansiRe = RegExp(escape(ansi(0)), 'g')

export const color = (string, id) => ansi(id) + string.replace(ansiRe, ansi(0) + ansi(id)) + ansi(0)

export const bold = (string) => color(string, 1)
export const dim = (string) => color(string, 2)
export const underline = (string) => color(string, 4)
export const invert = (string) => color(string, 7)

export const black = (string) => color(string, 30)
export const red = (string) => color(string, 31)
export const green = (string) => color(string, 32)
export const yellow = (string) => color(string, 33)
export const blue = (string) => color(string, 34)
export const magenta = (string) => color(string, 35)
export const cyan = (string) => color(string, 36)
export const white = (string) => color(string, 37)

export const bgBlack = (string) => color(string, 40)
export const bgRed = (string) => color(string, 41)
export const bgGreen = (string) => color(string, 42)
export const bgYellow = (string) => color(string, 43)
export const bgBlue = (string) => color(string, 44)
export const bgMagenta = (string) => color(string, 45)
export const bgCyan = (string) => color(string, 46)
export const bgWhite = (string) => color(string, 47)

export const pad = (string, size = 0, char = ' ') => string.padStart((string.length + size) / 2, char).padEnd(size, char)

export const box = ({
	name,
	types
}) => {
	const border = (text) => dim(cyan(text))
	const v = border('│')
	const h = (size) => border(pad('', size, '┈'))

	const nameLead = pad('', 16 - name.length / 2)
	const nameTail = pad('', nameLead.length + name.length % 2)
	const nullLine = pad('', 32)

	const kb = (kb) => bold(green(kb.slice(0, -3))) + ' ' + dim(kb.slice(-2))

	return [
		border(`╭────────────────────────────────╮`),
		`${v}${nameLead}${bold(white(name))}${nameTail}${v}`,
		`${v}${nullLine}${v}`,
		...Object.entries(types).map(([type, { min, gzp }]) => [
			`${v}  ${h(15 - type.length)} ${cyan(type)} ${h(15 - type.length - type.length % 2)}  ${v}`,
			`${v}  ${' '.repeat(3 - min.length % 2)}${kb(min + ' kB')}${' '.repeat(3)} ${border('╷')} ${' '.repeat(3 - gzp.length % 2)}${kb(gzp + ' kB')}${' '.repeat(3)} ${v}`,
			`${v}    ${dim(cyan('minified'))}    ${border('╵')}    ${dim(cyan('gzipped'))}    ${v}`,
		].join('\n')),
		border(`╰────────────────────────────────╯`),
	].join('\n')
} // prettier-ignore

export const passIcon = green('✔')
export const failIcon = red('✖')

export const passText = (text = 'PASS') => invert(green(bold(` ${text} `)))
export const failText = (text = 'FAIL') => invert(red(bold(` ${text} `)))
export const infoText = (text = 'INFO') => dim(text)
