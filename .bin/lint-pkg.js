import fs from './internal/fs.js'
import { bold, underline } from './internal/color.js'
import { isProcessMeta, getProcessArgOf } from './internal/process.js'
import { rootUrl, corePackageUrl, reactPackageUrl, stringifyPackageUrl } from './internal/dirs.js'
import { spawn } from './internal/spawn.js'

const packageCheckPathname = new URL('node_modules/@skypack/package-check/index.bin.js', rootUrl).pathname

export const lint = async (packageUrl, opts) => {
	opts = Object.assign({ only: [] }, opts)

	const packageJsonUrl = new URL(`package.json`, packageUrl)
	const packageName = JSON.parse(await fs.readFile(packageJsonUrl, 'utf8')).name

	if (!opts.only.length || opts.only.includes(packageName)) {
		console.log(underline(bold(packageName)))

		await spawn({
			args: [packageCheckPathname, '--cwd', packageUrl.pathname],
		})
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
