import { box } from './internal/color.js'
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
		transform(code, allImports, allExports) {
			const esmImports = []
			for (const from in allImports) {
				const esmImport = []
				for (const as in allImports[from]) {
					const name = allImports[from][as]
					esmImport.push(`${name} as ${as}`)
				}
				esmImports.push(`import{${esmImport.join(',')}}from"${from}";`)
			}
			const esmExports = []
			for (const from in allExports) {
				const esmExport = []
				for (const as in allExports[from]) {
					const name = allExports[from][as]
					esmExport.push(`${name} as ${as}`)
				}
				esmExports.push(`export{${esmExport.join(',')}}${from ? `from"${from}"` : ''}`)
			}
			return `${esmImports.join('')}${code}${esmExports.join(';')}`
		},
	},
	cjs: {
		extension: 'cjs',
		transform(code, allImports, allExports) {
			const esmImports = []
			for (const from in allImports) {
				const esmImport = []
				for (const as in allImports[from]) {
					const name = allImports[from][as]
					esmImport.push(`${name}:${as}`)
				}
				esmImports.push(`const{${esmImport.join(',')}}=require("${from}");`)
			}
			const esmExports = []
			for (const from in allExports) {
				const esmExport = []
				for (const as in allExports[from]) {
					const name = allExports[from][as]
					esmExport.push(`${name}:${as}`)
				}
				esmExports.push(`module.exports={${esmExport.join(',')}}`)
			}
			return `${esmImports.join('')}${code}${esmExports.join(';')}`
		},
	},
	iife: {
		extension: 'iife.js',
		transform(code, allImports, allExports) {
			const esmImports = []
			for (const from in allImports) {
				const esmImport = []
				for (const as in allImports[from]) {
					const name = allImports[from][as]
					esmImport.push(`${name}:${as}`)
				}
				esmImports.push(`const{${esmImport.join(',')}}=${from[0].toUpperCase() + from.slice(1)};`)
			}
			const esmExports = []
			for (const from in allExports) {
				const esmExport = []
				for (const as in allExports[from]) {
					const name = allExports[from][as]
					esmExport.push(`${as}:${name}`)
				}
				esmExports.push(`globalThis.stitches={${esmExport.join(',')}}`)
			}
			return `(()=>{${esmImports.join('')}${code}${esmExports.join(';')}})()`
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

		const extract = (code, keyword) => {
			const extractions = Object.create(null)
			const lead = code.indexOf(`${keyword}{`)
			if (lead === -1) return [extractions, code]
			const tail = code.indexOf('}', lead + 7) + 1
			if (tail === 0) return [extractions, code]
			const from = code.indexOf(';', tail + 1)
			const name = from === -1 ? '' : code.slice(tail + 5, from - 1)
			Array.from(code.slice(lead + 7, tail).matchAll(/([$\w]+) as (\w+),?/gy)).reduce((names, each) => Object.assign(names, { [each[2]]: each[1] }), (extractions[name] = Object.create(null)))
			return [
				extractions,
				code.slice(0, lead).concat(code.slice(from === -1 ? tail : from + 1))
			] // prettier-ignore
		}

		const [imports, codeWithoutImports] = extract(code, 'import')
		const [exports, codeWithoutExports] = extract(codeWithoutImports, 'export')

		// write variation builds
		for (const variant in variants) {
			const variantInfo = variants[variant]
			const variantPath = new URL(`dist/index.${variantInfo.extension}`, packageUrl).pathname
			const variantCode = variantInfo.transform(codeWithoutExports, imports, exports)
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
				`--exec "${['node', './.bin/build.js', ...onlyArgs].join(' ')}"`,
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
