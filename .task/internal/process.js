import URL from './url.js'

const {
	argv: [, file, ...argv],
} = process

/** Returns whether the import.meta matches the current process. */
export const isProcessMeta = (meta) => new URL(meta.url).href === URL.from(file).href

/** Returns the values for a given process argument. */
export const getProcessArgOf = (name) => {
	const lead = argv.indexOf('--' + name) + 1
	const tail = lead ? argv.slice(lead).findIndex((arg) => arg.startsWith('--')) : 0

	const vals = lead ? argv.slice(lead, ~tail ? lead + tail : argv.length) : []

	return lead ? (vals.length ? vals : [true]) : vals
}
