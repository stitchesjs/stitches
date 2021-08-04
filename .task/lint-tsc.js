import fs from './internal/fs.js'
import { bold, underline } from './internal/color.js'
import { corePackageUrl, reactPackageUrl, stringifyPackageUrl } from './internal/dirs.js'
import { isProcessMeta, getProcessArgOf } from './internal/process.js'
import * as cp from './internal/child_process.js'

export const lint = async (packageUrl, opts) => {
	opts = Object.assign({ only: [] }, opts)

	const packageJsonUrl = new URL(`package.json`, packageUrl)
	const packageName = JSON.parse(await fs.readFile(packageJsonUrl, 'utf8')).name
	const packageTsUrl = new URL(`types/index.d.ts`, packageUrl)

	if (!opts.only.length || opts.only.includes(packageName)) {
		console.log(underline(bold(packageName)))
		console.log(packageTsUrl.pathname)

		await cp.spawn('./node_modules/.bin/tsc', ['--noEmit', '--skipLibCheck', packageTsUrl.pathname])
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
