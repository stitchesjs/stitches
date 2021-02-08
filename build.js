// import MagicString from 'magic-string'
import esbuild from 'esbuild'
import { minify } from 'terser'
import fs from 'fs/promises'
// import mergeSourceMap from 'merge-source-map'
const { build } = esbuild

async function buildPackage(packageName) {
	const entryPoint = `./packages/${packageName}/src/index.js`
	const outEsmPath = `./packages/${packageName}/dist/index.esm.js`
	const outCjsPath = `./packages/${packageName}/dist/index.cjs.js`
	const outIfePath = `./packages/${packageName}/dist/index.iife.js`

	// Build ESM version
	const buildEsm = await build({
		bundle: true,
		entryPoints: [entryPoint],
		format: 'esm',
		outfile: outEsmPath,
		sourcemap: 'external',
		write: false,
	})

	const esmCode = buildEsm.outputFiles[1].text
	const esmCMap = buildEsm.outputFiles[0].text

	await fs.writeFile(outEsmPath, esmCode)
	await fs.writeFile(`${outEsmPath}.map`, esmCMap)

	// Build CJS version
	const buildCjs = await build({
		bundle: true,
		entryPoints: [entryPoint],
		format: 'cjs',
		outfile: outEsmPath,
		sourcemap: 'external',
		write: false,
	})

	const cjsCode = buildCjs.outputFiles[1].text
	const cjsCMap = buildCjs.outputFiles[0].text

	// const { code: cjsCode, map: cjsCMap } = await minify(esmCode, {
	// 	module: true,
	// 	sourceMap: { content: esmCMap },
	// 	toplevel: true,
	// })

	await fs.writeFile(outCjsPath, cjsCode)
	await fs.writeFile(`${outCjsPath}.map`, cjsCMap)

	// Build IIFE version
	const buildIfe = await build({
		bundle: true,
		entryPoints: [entryPoint],
		format: 'iife',
		outfile: outEsmPath,
		sourcemap: 'external',
		write: false,
		globalName: 'stitches'
	})

	const ifeCode = buildIfe.outputFiles[1].text
	const ifeCMap = buildIfe.outputFiles[0].text

	// const { code: ifeCode, map: ifeCMap } = await minify(esmCode, {
	// 	module: true,
	// 	sourceMap: { content: esmCMap },
	// 	toplevel: true,
	// })

	await fs.writeFile(outIfePath, ifeCode)
	await fs.writeFile(`${outIfePath}.map`, ifeCMap)
}

async function buildPackages() {
	await buildPackage('core')
	await buildPackage('react')
}

buildPackages()
