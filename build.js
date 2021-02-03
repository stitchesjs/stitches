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

	const { code, map } = await minify(esmText, { sourceMap: { content: mapText } })

	// Build ESM version
	const esmCode = new MagicString(code)

	esmCode.remove(code.length - 54, code.length).append(';export{createCss as default}')

	const esmMap = JSON.stringify(mergeSourceMap(JSON.parse(map), JSON.parse(esmCode.generateMap({
		source: 'bundle.js',
		hires: true,
	}).toString())))

	await fs.writeFile(outEsmPath, esmCode.toString())
	await fs.writeFile(`${outEsmPath}.map`, esmMap)

	// Build CJS version
	const cjsCode = new MagicString(code)

	cjsCode.remove(code.length - 54, code.length).append(';module.exports=createCss')

	const cjsMap = JSON.stringify(mergeSourceMap(JSON.parse(map), JSON.parse(cjsCode.generateMap({
		source: 'bundle.js',
		hires: true,
	}).toString())))

	await fs.writeFile(outCjsPath, esmCode.toString())
	await fs.writeFile(`${outCjsPath}.map`, cjsMap)

	// Build IIFE version
	const ifeCode = new MagicString(code)

	ifeCode.remove(code.length - 54, code.length).append(';return createCss})()').prepend('stitches=(()=>{')

	const ifeMap = JSON.stringify(mergeSourceMap(JSON.parse(map), JSON.parse(ifeCode.generateMap({
		source: 'bundle.js',
		hires: true,
	}).toString())))

	await fs.writeFile(outIfePath, esmCode.toString())
	await fs.writeFile(`${outIfePath}.map`, ifeMap)
}

async function buildPackages() {
	await buildPackage('core')
	await buildPackage('react')
}

buildPackages()
