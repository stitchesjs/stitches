import esbuild from 'esbuild'
import fs from './fs.mjs'
import zlib from 'zlib'
import { minify } from 'terser'
import { bold, underline } from './color.mjs'

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
			const cjsExports = ['__esModule:!0']
			for (const name in exports) cjsExports.push(`${name}:${exports[name]}`)
			return `${code}module.exports={${cjsExports.join(',')}}`
		},
	},
	iife: {
		extension: 'iife.js',
		transform(code, exports) {
			let iifeExports = ['globalThis.stitches=' + exports.default]
			for (let name in exports) if (name !== 'default') iifeExports.push(`stitches.${name}=${exports[name]}`)
			return `(()=>{${code}${iifeExports.join(';')}})()`
		},
	},
}

async function buildPackage(src) {
	const packageUrl = src
	const initPackageUrl = new URL('src/', packageUrl)
	const distPackageUrl = new URL('dist/', packageUrl)

	const packageJsonUrl = new URL(`package.json`, packageUrl)
	const packageName = JSON.parse(await fs.readFile(packageJsonUrl, 'utf8')).name

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

export default buildPackage

const metaUrl = new URL(import.meta.url)
const argvUrl = new URL(process.argv[1], 'file:')

if (metaUrl.href === argvUrl.href) {
	/** Root directory. */
	const rootUrl = new URL('../', metaUrl)

	/** Packages directory. */
	const packagesUrl = new URL('packages/', rootUrl)

	/** Core package directory. */
	const corePackageUrl = new URL('core/', packagesUrl)

	/** React package directory. */
	const reactPackageUrl = new URL('react/', packagesUrl)

	console.log()

	await buildPackage(corePackageUrl)

	console.log()

	await buildPackage(reactPackageUrl)
}
