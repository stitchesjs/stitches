import { box } from './internal/color.js'
import { corePackageUrl, reactPackageUrl, stringifyPackageUrl } from './internal/dirs.js'
import { isProcessMeta, getProcessArgOf } from './internal/process.js'
import esbuild from 'esbuild'
import fs from './internal/fs.js'
import nodemon from 'nodemon'
import zlib from 'zlib'
import { minify } from 'terser'

const matchImports = /import\s*([\w*${}\n\r\t, ]+)from\s*["']([^"']+)["'];?/g
const matchExports = /export\s*([\w*${}\n\r\t, ]+);?$/g
const matchNamings = /[{,]?([$\w]+)(?:\s+as\s+(\w+))?/gy

const variants = {
	esm: {
		extension: 'mjs',
		transformImports(allImports, from) {
			const defaultImports = []
			const imports = []
			for (const name in allImports) {
				const as = allImports[name]
				if (name === 'default') defaultImports.push(as)
				else imports.push(`${name} as ${as}`)
			}
			return `import${defaultImports.length ? ` ${defaultImports.join(',')} ` : ``}${imports.length ? `{${imports.join(',')}}` : ''}from"${from}";`
		},
		transformExports(allExports) {
			const exports = []
			for (const as in allExports) {
				const name = allExports[as]
				exports.push(`${name} as ${as}`)
			}
			return `export{${exports.join(',')}};`
		},
	},
	cjs: {
		extension: 'cjs',
		transformImports(allImports, from) {
			const defaultImports = []
			const imports = []
			for (const name in allImports) {
				const as = allImports[name]
				if (name === 'default') defaultImports.push(as)
				else imports.push(`${name}:${as}`)
			}
			return `const${defaultImports.length ? ` ${defaultImports.join(',')}` : imports.length ? `{${imports.join(',')}}` : ''}=require("${from}");`
		},
		transformExports(allExports) {
			const exports = []
			for (const as in allExports) {
				const name = allExports[as]
				exports.push(`${as}:${name}`)
			}
			return `module.exports={${exports.join(',')}};`
		},
	},
	iife: {
		extension: 'iife.js',
		transformImports(allImports, from) {
			const defaultImports = []
			const imports = []
			for (const name in allImports) {
				const as = allImports[name]
				if (name === 'default') defaultImports.push(as)
				else imports.push(`${name}:${as}`)
			}
			return `const${defaultImports.length ? ` ${defaultImports.join(',')}` : imports.length ? `{${imports.join(',')}}` : ''}=${from[0].toUpperCase() + from.slice(1)};`
		},
		transformExports(allExports) {
			const exports = []
			for (const as in allExports) {
				const name = allExports[as]
				exports.push(`${as}:${name}`)
			}
			return `globalThis.stitches={${exports.join(',')}};`
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
		const targetPathname = new URL('index.js', initPackageUrl).pathname
		const outputPathname = new URL('stitches.js', distPackageUrl).pathname

		// Build ESM version
		const {
			outputFiles: [cmapResult, codeResult],
		} = await esbuild.build({
			entryPoints: [targetPathname],
			outfile: outputPathname,
			bundle: true,
			external: ['react'],
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
		const size = {
			name: packageName,
			types: {},
		}

		// write variation builds
		for (const variant in variants) {
			const variantInfo = variants[variant]
			const variantPath = new URL(`dist/index.${variantInfo.extension}`, packageUrl).pathname

			matchImports.lastIndex = 0
			matchExports.lastIndex = 0
			const variantCode =
			code.replace(matchImports, (_, statement, from) => {
				matchNamings.lastIndex = 0
				const allImports = Array.from(
					statement.matchAll(matchNamings)
				).reduce(
					(allImports, each) => Object.assign(allImports, { [each[2] || 'default']: each[1] }),
					{}
				)
				return variantInfo.transformImports(allImports, from)
			}).replace(matchExports, (_, statement) => {
				matchNamings.lastIndex = 0
				const allExports = Array.from(
					statement.matchAll(matchNamings)
				).reduce(
					(allExports, each) => Object.assign(allExports, { [each[2] || each[1]]: each[1] }),
					{}
				)
				return variantInfo.transformExports(allExports)
			}) // prettier-ignore

			const variantMins = (Buffer.byteLength(variantCode) / 1000).toFixed(2)
			const variantGzip = Number(zlib.gzipSync(variantCode, { level: 9 }).length / 1000).toFixed(2)

			size.types[variant] = {
				min: variantMins,
				gzp: variantGzip,
			}

			await fs.writeFile(variantPath, variantCode + `\n//# sourceMappingUrl=index.map`)
		}

		console.log(box(size))
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
				`--exec "${['node', './.task/build.js', ...onlyArgs].join(' ')}"`,
			].join(' '),
		).on('start', () => {
			process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
			console.clear()
		}).on('quit', () => process.exit()) // prettier-ignore
	} else {
		buildAll({
			only: getProcessArgOf('only'),
		}).catch((error) => {
			console.error(error)

			process.exitCode = 1
		})
	}
}
