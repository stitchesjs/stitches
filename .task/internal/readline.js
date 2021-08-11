import * as readline from 'readline'

export * from 'readline'

/** Displays the query, awaits user input, and returns the provided input. */
export const question = (
	/** @type {string} */ query,
	/** @type {import('events').Abortable} */
	opts = undefined
) => new Promise(resolver => {
	query = String(query).replace(/[^\s]$/, '$& ')

	opts = Object(opts)

	const int = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	int.question(query, opts, answer => {
		int.close()

		resolver(answer)
	})
})
