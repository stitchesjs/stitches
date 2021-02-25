/** Root directory. */
export const rootUrl = new URL('../', import.meta.url)

/** Packages directory. */
export const packagesUrl = new URL('packages/', rootUrl)

/** Core package directory. */
export const corePackageUrl = new URL('core/', packagesUrl)

/** React package directory. */
export const reactPackageUrl = new URL('react/', packagesUrl)
