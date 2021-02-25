import fs from './fs.mjs'
import { corePackageUrl, reactPackageUrl, rootUrl } from './build-dirs.mjs'
import { bold, dim, underline } from './color.mjs'

async function buildShared(packageUrl) {
	const sharedUrl = new URL('shared/', rootUrl)
	const packageJsonUrl = new URL(`package.json`, packageUrl)
	const packageName = JSON.parse(await fs.readFile(packageJsonUrl, 'utf8')).name

	for (const dirent of await fs.readdir(sharedUrl, { withFileTypes: true })) {
		const sourceUrl = new URL(dirent.name + '/', sharedUrl)
		const sourceLog = sourceUrl.pathname.slice(rootUrl.pathname.length, -1)

		if (dirent.isDirectory()) {
			const targetUrl = new URL(dirent.name + '/', packageUrl)

			await fs.rmdir(targetUrl, { recursive: true })

			await fs.copydir(sourceUrl, targetUrl)

			console.log([bold(sourceLog), dim('copied to'), bold(underline(packageName))].join(' '))
		}
	}
}

export default buildShared

const metaUrl = new URL(import.meta.url)
const argvUrl = new URL(process.argv[1], 'file:')

if (metaUrl.href === argvUrl.href) {
	console.log('')

	buildShared(corePackageUrl)
	buildShared(reactPackageUrl)
}
