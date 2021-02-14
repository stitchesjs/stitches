import nodemon from 'nodemon'
import process from 'process'

nodemon(
	[
		// prettier-ignore
		`--watch packages/core/src`,
		`--watch packages/core/tests`,
		`--watch packages/react/src`,
		`--watch packages/react/tests`,
		`--exec "clear; ${['npm', 'run', 'build'].concat(process.argv.slice(2)).join(' ')}"`,
	].join(' '),
).on('quit', () => process.exit())
