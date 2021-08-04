import fs from 'fs/promises'
import { copyFile, mkdir, readdir } from 'fs/promises'
import URL from './URL.js'

export * from 'fs/promises'
export { existsSync as exists } from 'fs'

/** Asynchronously copies dir to dest. By default, dest is overwritten if it already exists. */
export const copydir = async function copydir(src, dst) {
	let copydir = async (src, dst) => {
		await mkdir(dst, { recursive: true })

		for (const dirent of await readdir(src, { withFileTypes: true })) {
			await (dirent.isDirectory() ? copydir : copyFile)(
				src.asDir.to(dirent.name),
				dst.asDir.to(dirent.name)
			)
		}
	}

	copydir(URL.from(src), URL.from(dst))
}

fs.copydir = copydir

export default fs
