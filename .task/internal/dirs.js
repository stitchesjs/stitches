import process from 'node:process'
import URL from './url.js'

/** Root directory. */
export const rootUrl = new URL('../../', import.meta.url)

/** Packages directory. */
export const packagesUrl = new URL('packages/', rootUrl)

/** Core package directory. */
export const corePackageUrl = new URL('core/', packagesUrl)

/** Core tests directory. */
export const coreTestsUrl = new URL('tests/', corePackageUrl)

/** React package directory. */
export const reactPackageUrl = new URL('react/', packagesUrl)

/** React tests directory. */
export const reactTestsUrl = new URL('tests/', reactPackageUrl)

/** Stringify package directory */
export const stringifyPackageUrl = new URL('stringify/', packagesUrl)

/** React tests directory. */
export const stringifyTestsUrl = new URL('tests/', stringifyPackageUrl)

/** Current file href. */
export const argv1Url = new URL(process.argv[1], 'file:').href
