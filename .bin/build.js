import { bold, underline } from './internal/color.js'
import { corePackageUrl, reactPackageUrl, stringifyPackageUrl } from './internal/dirs.js'
import { isProcessMeta, getProcessArgOf } from './internal/process.js'
import esbuild from 'esbuild'
import fs from './internal/fs.js'
import nodemon from 'nodemon'
import zlib from 'zlib'
import { minify } from 'terser'

const variants = {
	esm: {
		extension: 'mjs',
		transform(code, exports) {
			const esmExports = []
			for (const name in exports) esmExports.push(`${exports[name]} as ${name}`)
			return `${code}export{${esmExports.join(',')}}`
		},
	},
	cjs: {
		extension: 'cjs',
		transform(code, exports) {
			const cjsExports = []
			for (const name in exports) cjsExports.push(`${name}:${exports[name]}`)
			return `${code}module.exports={${cjsExports.join(',')}}`
		},
	},
	iife: {
		extension: 'iife.js',
		transform(code, exports) {
			const iifeExports = []
			for (const name in exports) iifeExports.push(`${name}:${exports[name]}`)
			return `(()=>{${code}globalThis.stitches={${iifeExports.join(',')}}})()`
		},
	},
}

export const build = async (packageUrl, opts) => {
	opts = Object.assign({ only: [] }, opts)

	const initPackageUrl = new URL('src/', packageUrl)
	const distPackageUrl = new URL('dist/', packageUrl)

	const packageJsonUrl = new URL(`package.json`, packageUrl)
	const packageName = JSON.parse(await fs.readFile(packageJsonUrl, 'utf8')).name

	if (!opts.only.length || opts.only.includes(packageName)) {
		console.log()
		console.log(underline(bold(packageName)))
		console.log()

		const targetPathname = new URL('index.js', initPackageUrl).pathname
		const outputPathname = new URL('stitches.js', distPackageUrl).pathname

		// Build ESM version
		const {
			outputFiles: [cmapResult, codeResult],
		} = await esbuild.build({
			entryPoints: [targetPathname],
			outfile: outputPathname,
			bundle: true,
			format: 'esm',
			sourcemap: 'external',
			write: false,
		})

		// Minify ESM version
		const { code, map } = await minify(codeResult.text, {
			sourceMap: { content: cmapResult.text },
			compress: true,
			module: true,
			mangle: true,
			toplevel: true,
		})

		// ensure empty dist directory
		await fs.mkdir(distPackageUrl, { recursive: true })

		// write map
		fs.writeFile(new URL(`index.map`, distPackageUrl), map)

		// prepare variations
		const splitByExport = (code, index = code.indexOf('export')) => [code.slice(0, index), code.slice(index)]
		const [lead, tail] = splitByExport(code)

		const exports = Array.from(tail.matchAll(/([$\w]+) as (\w+)/g)).reduce((exports, each) => Object.assign(exports, { [each[2]]: each[1] }), Object.create(null))

		// write variation builds
		for (const variant in variants) {
			const variantInfo = variants[variant]
			const variantPath = new URL(`dist/index.${variantInfo.extension}`, packageUrl).pathname
			const variantCode = variantInfo.transform(lead, exports)
			const variantSize = Number((zlib.gzipSync(variantCode, { level: 9 }).length / 1000).toFixed(2))

			console.log(' ', `\x1b[33m${variantSize} kB\x1b[0m`, `\x1b[2m(${variant})\x1b[0m`)

			await fs.writeFile(variantPath, variantCode + `\n//# sourceMappingUrl=index.map`)
		}
	}
}

export const buildAll = async (opts) => {
	await build(stringifyPackageUrl, opts)
	await build(corePackageUrl, opts)
	await build(reactPackageUrl, opts)
}

if (isProcessMeta(import.meta)) {
	if (getProcessArgOf('watch').includes(true)) {
		let onlyArgs = getProcessArgOf('only')

		onlyArgs = onlyArgs.length ? ['--only', ...onlyArgs] : onlyArgs

		nodemon(
			[
				// prettier-ignore
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
				`--exec "${['node', './.bin/build.js', ...onlyArgs].join(' ')}"`,
			].join(' '),
		)
			.on('start', () => {
				process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
				console.clear()
			})
			.on('quit', () => process.exit())
	} else {
		buildAll({
			only: getProcessArgOf('only'),
		}).catch((error) => {
			console.error(error)

			process.exitCode = 1
		})
	}
}
