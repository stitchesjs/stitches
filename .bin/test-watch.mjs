import nodemon from 'nodemon'

nodemon(
	[
		// prettier-ignore
		`--watch packages/core/src`,
		`--watch packages/core/tests`,
		`--watch packages/react/src`,
		`--watch packages/react/tests`,
		`--exec "clear; ${['node', '.bin/test.mjs'].concat(process.argv.slice(2)).join(' ')}"`,
	].join(' '),
)
	.on('start', () => {
		process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
		console.clear()
	})
	.on('quit', () => process.exit())
