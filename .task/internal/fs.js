import fs from 'fs/promises'
import { copyFile, mkdir, readdir } from 'fs/promises'
import URL from './url.js'

export * from 'fs/promises'
export { existsSync as exists } from 'fs'

/** Asynchronously copies dir to dest. By default, dest is overwritten if it already exists. */
export const copydir = async function copydir(src, dst) {
	let copydir = async (src, dst) => {
		await mkdir(dst, { recursive: true })

		for (const dirent of await readdir(src, { withFileTypes: true })) {
			await (dirent.isDirectory() ? copydir : copyFile)(
				src.dir.to(dirent.name),
				dst.dir.to(dirent.name)
			)
		}
	}

	copydir(URL.from(src), URL.from(dst))
}

/** Asynchronously reads a file as parsed JSON. */
export const readFileJson = {
	async readFileJson(/** @type {import('fs').PathLike | fs.FileHandle} */ path) {
		const json = await fs.readFile(path, 'utf8')

		/** @type {JSONValue} */
		const data = JSON.parse(json)

		return data
	}
}.readFileJson

fs.copydir = copydir
fs.readFileJson = readFileJson

/** @typedef { string | number | boolean | null | JSONArray | JSONObject } JSONValue */
/** @typedef { JSONValue[] } JSONArray */
/** @typedef {{ [k: string]: JSONValue }} JSONObject */

export default fs
