import { fileURLToPath, pathToFileURL } from 'url';

export default class URL extends globalThis.URL {
	to(/** @type {string[]} */ ...segments) {
		return segments.reduce((/** @type URL */ url, segment) => new URL(segment, url), this)
	}

	includes(/** @type {string} */ searchString, position = 0) {
		return this.href.includes(searchString, position)
	}

	endsWith(/** @type {string} */ searchString, length = this.href.length) {
		return this.href.endsWith(searchString, length)
	}

	get dir() {
		return new URL(this.href + '/')
	}

	get ospathname() {
		return fileURLToPath(this)
	}

	static from(/** @type {string | globalThis.URL} */ segment, /** @type {string[]} */ ...segments) {
		return (
			/^file:/.test(segment)
				? new URL(segment)
			: new URL(pathToFileURL(segment))
		).to(...segments)
	}
}
