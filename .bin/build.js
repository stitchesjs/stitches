import buildPackage from './build-package.js'
import buildShared from './build-shared.js'
import fs from './fs.js'
import { corePackageUrl, reactPackageUrl } from './internal/dirs.js'

async function build() {
	console.log()

	await fs.rmdir(new URL('dist/', corePackageUrl), { recursive: true })
	await fs.rmdir(new URL('dist/', reactPackageUrl), { recursive: true })

	await buildPackage(corePackageUrl)

	console.log()

	await buildPackage(reactPackageUrl)

	console.log()

	await buildShared(corePackageUrl)

	await buildShared(reactPackageUrl)

	console.log()
}

const metaUrl = new URL(import.meta.url)
const argvUrl = new URL(process.argv[1], 'file:')

if (metaUrl.href === argvUrl.href) build()
