import { readdir } from 'fs/promises'
import { deepStrictEqual, strictEqual, notDeepStrictEqual, notStrictEqual } from 'assert'

const didFail = Symbol.for('test.failure')
const root = new URL('.', import.meta.url)

const passIcon = '\x1b[32m✔\x1b[0m'
const failIcon = '\x1b[31m✖\x1b[0m'
const passText = '\x1b[42m\x1b[30m PASS \x1b[0m'
const failText = '\x1b[41m\x1b[30m FAIL \x1b[0m'

const info = (text) => `\x1b[2m${text}\x1b[0m`

Promise.all([
	new URL('./packages/core/tests/', root),
	new URL('./packages/react/tests/', root),
].map(async dir => {
	global.expect = thingA => ({
		toEqual: deepStrictEqual.bind(null, thingA),
		toBe: strictEqual.bind(null, thingA),
		toBeInstanceOf: thingB => strictEqual(true, thingA instanceof thingB),
		not: {
			toEqual: notDeepStrictEqual.bind(null, thingA),
			toBe: notStrictEqual.bind(null, thingA),
			toBeInstanceOf: thingB => strictEqual(false, thingA instanceof thingB),
		},
	})

	await readdir(dir).then(async (files) => {
		// test all files in the test directory
		const results = Object.create(null)
		for (let file of files) {
			if (!/^(js)$/.test(file.split('.').pop())) continue
			results[file] = Object.create(null)
			global.describe = async (descText, descFunc) => {
				results[file][descText] = Object.create(null)
				global.test = async (testText, testFunc) => {
					results[file][descText][testText] = []
					try {
						await testFunc()
						results[file][descText][testText].push(`${passIcon} ${info(testText)}`)
					} catch (error) {
						results[file][descText][testText].push(`${failIcon} ${info(testText)}`)
						results[file][descText][testText].push(String(error.message))
						results[file][descText][testText][didFail] = error
						results[file][descText][didFail] = true
						results[file][didFail] = true
					}
				}
				try {
					await descFunc()
				} catch (error) {
					results[file][descText][didFail] = error
				}
			}
			try {
				await import(new URL(file, dir))
			} catch (error) {
				results[file][didFail] = error
			}
		}

		let lastFile
		for (let file in results) {
			// space out failures
			if (results[lastFile] && (!!results[lastFile][didFail] != !!results[file][didFail])) console.log()
			console.group(results[file][didFail] ? failText : passText, info(new URL(file, dir).href.slice(root.href.length)))
			// if tests failured, report detailed results
			if (results[file][didFail]) {
				for (let descText in results[file]) {
					// report test failures
					console.group(results[file][didFail] ? failIcon : passIcon, info(descText))
					for (let testText in results[file][descText]) {
						console.log(results[file][descText][testText].join('\n'))
					}
					console.groupEnd()
				}
				// report file errors
				if (results[file][didFail] !== true) console.log(results[file][didFail])
			}
			console.groupEnd()
			lastFile = file
		}
	})
}))
