import esbuild from 'esbuild'
import fs from 'fs/promises'
import zlib from 'zlib'
import { minify } from 'terser'

async function buildPackage(release, variants) {
	const rootPackageURL = new URL(release + '/', pkgsURL)
	const initPackageURL = new URL('src/', rootPackageURL)
	const distPackageURL = new URL('dist/', rootPackageURL)

	console.log()
	console.log(`\x1b[4m\x1b[1m${JSON.parse(await fs.readFile(new URL(`package.json`, rootPackageURL))).name}\x1b[0m`)
	console.log()

	const targetPathname = new URL('index.js', initPackageURL).pathname
	const outputPathname = new URL('stitches.js', distPackageURL).pathname

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
	await fs.mkdir(distPackageURL, { recursive: true })

	for (const distFile of await fs.readdir(distPackageURL)) {
		await fs.unlink(new URL(distFile, distPackageURL))
	}

	// write map
	fs.writeFile(new URL(`stitches.${release}.map`, distPackageURL), map)

	// prepare variations
	const splitByExport = (code, index = code.indexOf('export')) => [code.slice(0, index), code.slice(index)]
	const [lead, tail] = splitByExport(code)

	const exports = Array.from(tail.matchAll(/(\w+) as (\w+)/g)).reduce((exports, each) => Object.assign(exports, { [each[2]]: each[1] }), Object.create(null))

	// write variation builds
	for (const variant in variants) {
		const variantInfo = variants[variant]
		const variantPath = new URL(`dist/stitches.${release}.${variant}.${variantInfo.extension}`, rootPackageURL).pathname
		const variantCode = variantInfo.transform(lead, exports)
		const variantSize = Number((zlib.gzipSync(variantCode, { level: 9 }).length / 1000).toFixed(2))

		console.log(' ', `\x1b[33m${variantSize} kB\x1b[0m`, `\x1b[2m(${variant})\x1b[0m`)

		await fs.writeFile(variantPath, variantCode + `\n//# sourceMappingURL=stitches.${release}.map`)
	}
}

/** Packages directory. */
const pkgsURL = new URL('../packages/', import.meta.url)

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
		extension: 'js',
		transform(code, exports) {
			let iifeExports = ['globalThis.stitches=' + exports.default]
			for (let name in exports) if (name !== 'default') iifeExports.push(`stitches.${name}=${exports[name]}`)
			return `(()=>{${code}${iifeExports.join(';')}})()`
		},
	},
}

const buildCore = async () => {
	await buildPackage('core', variants)
	await buildPackage('react', variants)
}

const buildReact = async () => {
	await buildPackage('react', variants)
}

if (process.argv.includes('--watch')) {
	Array.from(
		[
			[new URL('core/src/', pkgsURL).pathname, buildCore],
			[new URL('react/src/', pkgsURL).pathname, buildReact],
		],
		([watchdir, build]) => new FSWatcher(watchdir, build),
	)
} else {
	buildCore().then(() => console.log())
}
