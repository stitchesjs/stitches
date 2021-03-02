import fs from 'fs/promises'
import { copyFile, mkdir, readdir } from 'fs/promises'

export * from 'fs/promises'

/** Asynchronously copies dir to dest. By default, dest is overwritten if it already exists. */
export const copydir = async function copydir(src, dest) {
	await mkdir(dest, { recursive: true })

	const dirents = await readdir(src, { withFileTypes: true })

	for (const dirent of dirents) {
		const sourceURL = new URL(dirent.name + '/', src)
		const targetURL = new URL(dirent.name + '/', dest)
		if (dirent.isDirectory()) await copydir(sourceURL, targetURL)
	}

	for (const dirent of dirents) {
		const sourceURL = new URL(dirent.name, src)
		const targetURL = new URL(dirent.name, dest)
		if (!dirent.isDirectory()) await copyFile(sourceURL, targetURL)
	}
}

fs.copydir = copydir

export default fs
