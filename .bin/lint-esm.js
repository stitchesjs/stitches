import fs from './internal/fs.js'
import { bold, underline } from './internal/color.js'
import { corePackageUrl, reactPackageUrl, stringifyPackageUrl } from './internal/dirs.js'
import { isProcessMeta, getProcessArgOf } from './internal/process.js'
import { ESLint } from 'eslint'

export const lint = async (packageUrl, opts) => {
	opts = Object.assign({ only: [] }, opts)

	const packageJsonUrl = new URL(`package.json`, packageUrl)
	const packageName = JSON.parse(await fs.readFile(packageJsonUrl, 'utf8')).name
	const packageTsUrl = new URL(`types/index.d.ts`, packageUrl)

	if (!opts.only.length || opts.only.includes(packageName)) {
		console.log(underline(bold(packageName)))
		console.log(packageTsUrl.pathname)

		const eslint = new ESLint()

		const results = await eslint.lintFiles([packageTsUrl.pathname])

		const formatter = await eslint.loadFormatter('stylish')
		const resultText = formatter.format(results)

		if (resultText) console.log(resultText)
		else console.log('\x1b[32m✔\x1b[0m', 'Your code is flawless.', 'Hopefully this determination is flawless, too.')
	}
}

export const lintAll = async (opts) => {
	await lint(stringifyPackageUrl, opts)
	await lint(corePackageUrl, opts)
	await lint(reactPackageUrl, opts)
}

if (isProcessMeta(import.meta)) {
	lintAll({
		only: getProcessArgOf('only'),
	}).catch((error) => {
		console.error(error)

		process.exitCode = 1
	})
}
