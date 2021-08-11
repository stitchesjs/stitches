import { passIcon, failIcon, passText, failText, infoText, dim, green } from './internal/color.js'
import { isProcessMeta, getProcessArgOf } from './internal/process.js'
import * as fs from './internal/fs.js'
import nodemon from 'nodemon'
import URL from './internal/url.js'

const root = URL.from(import.meta.url).to('../')

const main = async (pkg, opts) => {
	let didFailLast

	// for each file in the testing directory
	for (let file of await fs.readdir(pkg.to('tests/'))) {
		file = pkg.to('tests/').to(file)

		// filter non-js files
		if (!file.endsWith('.js')) continue

		// filter non-matching files
		if (opts.only.length && !opts.only.some(name => file.includes(name))) continue

		/** Test results. */
		const results = Object.create(null)

		// bootstrap the expect api
		globalThis.expect = (await import('./internal/expect.js')).default

		// bootstrap the describe api
		global.describe = async (description, call) => {
			// prepare description results
			results[description] = Object.create(null)

			// bootstrap the test api
			global.test = async (test, call) => {
				// prepare test results
				results[description][test] = []

				try {
					// run the test
					await call()

					// assign success to the results
					results[description][test].push(`${passIcon} ${infoText(test)}`)
				} catch (error) {
					error.stack = error.stack || error.message || String(error || '')

					error.stack = [ ...error.stack.split(/\n/g).slice(1)].join('\n')

					// assign failure to the results
					results[description][test].push(`${failIcon} ${infoText(test)}`, getErrorStack(error), '')
					results[description][test][didFail] = error
					results[description][didFail] = true
					results[didFail] = true
				}
			}

			try {
				// run the description
				await call()
			} catch (error) {
				// assign description failure to the results
				results[description][''] = [`${failIcon} ${infoText('Error')}`, String(error.message)]
			}
		}

		try {
			// run the test file
			await import(file)
		} catch (error) {
			// report errors running the test file
			results[didFail] = error
		}

		const failure = results[didFail]

		// space out failures
		if (didFailLast && !!didFailLast != !!failure) console.log()

		// report details if there is a failure
		console.group(failure ? failText('FAIL') : passText('PASS'), infoText(file.href.slice(root.href.length)))

		if (failure) {
			process.exitCode = 1

			for (let description in results) {
				// report each description
				console.group(failure ? failIcon : passIcon, infoText(description))

				for (let test in results[description]) {
					// report each test
					console.log(results[description][test].join('\n'))
				}

				console.groupEnd()
			}

			// report any file error
			if (typeof failure === 'object') {
				console.log(getErrorStack(failure))
			}
		}

		console.groupEnd()

		didFailLast = results[didFail]
	}
} // prettier-ignore

const didFail = Symbol.for('test.failure')

const getErrorStack = (error) => error.stack.split(/\n/g).filter(
	(line) => !line.includes(import.meta.url) && !line.includes('node:')
).map(
	(line) => line.replace(
		/(.*?)\(?(file:[^:]+)(.*?)\)?$/,
		($0, before, file, after) => (
			before.replace(/(at) ([^\s]+)?(.*)/, `${dim('$1')} ${green('$2')}$3`) +
			file.slice(root.href.length) +
			dim(after)
		)
	)
).join('\n') // prettier-ignore

export const testAll = async (opts) => {
	await main(URL.from(import.meta.url, '../packages/stringify/'), opts)
	await main(URL.from(import.meta.url, '../packages/core/'), opts)
	await main(URL.from(import.meta.url, '../packages/react/'), opts)
}

if (isProcessMeta(import.meta)) {
	if (getProcessArgOf('watch').includes(true)) {
		let onlyArgs = getProcessArgOf('only')

		onlyArgs = onlyArgs.length ? ['--only', ...onlyArgs] : onlyArgs

		nodemon(
			[
				'-q',
				`--watch packages/core/src`,
				`--watch packages/core/tests`,
				`--watch packages/core/types`,
				`--watch packages/react/src`,
				`--watch packages/react/tests`,
				`--watch packages/react/types`,
				`--watch packages/stringify/src`,
				`--watch packages/stringify/tests`,
				`--watch packages/stringify/types`,

				// exec
				`--exec "${['node', './.task/test.js', ...onlyArgs].join(' ')}"`,
			].join(' '),
		).on('start', () => {
			process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
			console.clear()
		}).on('quit', () => process.exit()) // prettier-ignore
	} else {
		testAll({
			only: getProcessArgOf('only'),
		}).catch((error) => {
			console.error(error)

			process.exitCode = 1
		})
	}
}
