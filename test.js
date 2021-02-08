import { readdir } from 'fs/promises'
import { deepEqual, equal, notDeepEqual, notEqual } from 'assert/strict'

const test = async root => await Promise.all([
	// testing directories from core and react
	new URL('./packages/core/tests/', root),
	new URL('./packages/react/tests/', root),
].map(async dir => {
	// bootstrap the expect api
	globalThis.expect = foo => ({
		toEqual: bar => deepEqual(foo, bar),
		toBe: bar => equal(foo, bar),
		toBeInstanceOf: bar => equal(foo instanceof bar, true),
		not: {
			toEqual: bar => notDeepEqual(foo, bar),
			toBe: bar => notEqual(foo, bar),
			toBeInstanceOf: bar => equal(foo instanceof bar, false),
		},
	})

	// internal strings and symbols used for reporting
	const passIcon = '\x1b[32m✔\x1b[0m'
	const failIcon = '\x1b[31m✖\x1b[0m'
	const passText = '\x1b[42m\x1b[30m PASS \x1b[0m'
	const failText = '\x1b[41m\x1b[30m FAIL \x1b[0m'
	const info = text => `\x1b[2m${text}\x1b[0m`
	const didFail = Symbol.for('test.failure')
	let didFailLast;

	// for each file in the testing directory
	for (let file of await readdir(dir)) {
		// ignore non-js files
		if (!file.endsWith('.js')) continue

		// prepare file results
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
					results[description][test].push(`${passIcon} ${info(test)}`)
				} catch (e) {
					// assign failure to the results
					results[description][test].push(`${failIcon} ${info(test)}`)
					results[description][test].push(String(e.message))
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
				results[description][''] = [`${failIcon} ${info('Error')}`, String(e.message)]
			}
		}

		try {
			// run the test file
			await import(new URL(file, dir))
		} catch (e) {
			// report errors running the test file
			results[didFail] = e
		}

		// space out failures
		if (didFailLast && (!!didFailLast != !!results[didFail])) console.log()

		// report details if there is a failure
		console.group(results[didFail] ? failText : passText, info(new URL(file, dir).href.slice(root.href.length)))

		if (results[didFail]) {
			for (let description in results) {
				// report each description
				console.group(results[didFail] ? failIcon : passIcon, info(description))
				for (let test in results[description]) {
					// report each test
					console.log(results[description][test].join('\n'))
				}
				console.groupEnd()
			}

			// report any file error
			if (results[didFail] !== true) console.log(results[didFail])
		}

		console.groupEnd()

		didFailLast = results[didFail]
	}
}))

test(new URL('.', import.meta.url))
