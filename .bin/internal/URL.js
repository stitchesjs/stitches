import { pathToFileURL } from 'url';

export class URL extends globalThis.URL {
	resolve(/** @type {string} */ pathname) {
		return new URL(pathname, this)
	}

	get segments() {
		return this.pathname.slice(1).split('/')
	}

	static fromPath(segment) {
		return new URL(pathToFileURL(segment))
	}
}
