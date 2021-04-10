import { passIcon, failIcon, passText, failText, infoText, dim, green } from './internal/color.js'
import { rootUrl, corePackageUrl, reactPackageUrl, stringifyPackageUrl } from './internal/dirs.js'
import { isProcessMeta, getProcessArgOf } from './internal/process.js'
import expect from './internal/expect.js'
import fs from './internal/fs.js'
import nodemon from 'nodemon'

const didFail = Symbol.for('test.failure')

const getErrorStack = (error) => error.stack.split(/\n/g).filter(
	(line) => !line.includes(import.meta.url) && !line.includes('node:')
).map(
	(line) => line.replace(
		/(.*?)\(?(file:[^:]+)(.*?)\)?$/,
		($0, before, file, after) => (
			before.replace(/(at) ([^\s]+)?(.*)/, `${dim('$1')} ${green('$2')}$3`) +
			file.slice(rootUrl.href.length) +
			dim(after)
		)
	)
).join('\n') // prettier-ignore

const test = async (packageUrl, opts) => {
	/** testing directory */
	const packageTestsUrl = new URL('./tests/', packageUrl)

	// bootstrap the expect api
	globalThis.expect = expect

	let didFailLast

	// for each file in the testing directory
	for (let file of await fs.readdir(packageTestsUrl)) {
		/** Test file Url. */
		const fileUrl = new URL(file, packageTestsUrl)

		/** Root relative path, used for filtering files/ */
		const rootRelativePath = fileUrl.href.slice(rootUrl.href.length)

		// filter non-js files
		if (!file.endsWith('.js')) continue

		// filter non-matching files
		if (opts.only.length && !opts.only.some((name) => rootRelativePath.includes(name))) continue

		/** Test results. */
		const results = Object.create(null)

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
				} catch (e) {
					e.stack = e.stack || e.message || String(e || '')

					e.stack = [ ...e.stack.split(/\n/g).slice(1)].join('\n')

					// assign failure to the results
					results[description][test].push(`${failIcon} ${infoText(test)}`, getErrorStack(e), '')
					results[description][test][didFail] = e
					results[description][didFail] = true
					results[didFail] = true
				}
			}

			try {
				// run the description
				await call()
			} catch (e) {
				// assign description failure to the results
				console.log({ 'e.message': e.message })
				results[description][''] = [`${failIcon} ${infoText('Error')}`, String(e.message)]
			}
		}

		try {
			// run the test file
			await import(fileUrl)
		} catch (e) {
			// report errors running the test file
			results[didFail] = e
		}

		const failure = results[didFail]

		// space out failures
		if (didFailLast && !!didFailLast != !!failure) console.log()

		// report details if there is a failure
		console.group(failure ? failText('FAIL') : passText('PASS'), infoText(rootRelativePath))

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

export const testAll = async (opts) => {
	await test(stringifyPackageUrl, opts)
	await test(corePackageUrl, opts)
	await test(reactPackageUrl, opts)
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
				`--exec "${['node', './.bin/test.js', ...onlyArgs].join(' ')}"`,
			].join(' '),
		)
			.on('start', () => {
				process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
				console.clear()
			})
			.on('quit', () => process.exit())
	} else {
		testAll({
			only: getProcessArgOf('only'),
		})
	}
}
