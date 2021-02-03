import MagicString from 'magic-string'
import esbuild from 'esbuild'
import { minify } from 'terser'
import fs from 'fs/promises'
import mergeSourceMap from 'merge-source-map'
const { build } = esbuild

async function buildPackage(packageName) {
	const entryPoint = `./packages/${packageName}/src/index.js`
	const outCjsPath = `./packages/${packageName}/dist/index.cjs.js`
	const outEsmPath = `./packages/${packageName}/dist/index.esm.js`
	const outIfePath = `./packages/${packageName}/dist/index.iife.js`

	const buildEsm = await build({
		bundle: true,
		entryPoints: [entryPoint],
		format: 'esm',
		outfile: outEsmPath,
		sourcemap: 'external',
		write: false,
	})

	const mapText = buildEsm.outputFiles[0].text
	const esmText = buildEsm.outputFiles[1].text

	const { code, map } = await minify(esmText, { toplevel: true, module: true, compress: { unsafe: true }, sourceMap: { content: mapText } })

	const clipEnd = code.length
	const clipStart = clipEnd - 21
	const clipExport = packageName === 'core' ? 'S' : 'w'

	// Build ESM version
	await fs.writeFile(outEsmPath, code)
	await fs.writeFile(`${outEsmPath}.map`, map)

	// Build CJS version
	const cjsCode = new MagicString(code)

	cjsCode.remove(clipStart, clipEnd).append('module.exports=' + clipExport)

	const cjsMap = mergeSourceMap(JSON.parse(map), JSON.parse(cjsCode.generateMap({
		source: 'bundle.js',
		hires: true,
	}).toString()))

	await fs.writeFile(outCjsPath, cjsCode.toString())
	await fs.writeFile(`${outCjsPath}.map`, JSON.stringify(cjsMap))

	// Build IIFE version
	const ifeCode = new MagicString(code)

	ifeCode.remove(clipStart, clipEnd).append('return createCss})()').prepend('stitches=(()=>{')

	const ifeMap = mergeSourceMap(JSON.parse(map), JSON.parse(ifeCode.generateMap({
		source: 'bundle.js',
		hires: true,
	}).toString()))

	await fs.writeFile(outIfePath, ifeCode.toString())
	await fs.writeFile(`${outIfePath}.map`, JSON.stringify(ifeMap))
}

async function buildPackages() {
	await buildPackage('core')
	await buildPackage('react')
}

buildPackages()
