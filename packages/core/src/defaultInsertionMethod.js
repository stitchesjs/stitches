import { assign } from './Object.js'

export default (init) => {
	const isAppend = init.insertionMethod === 'append'

	let currentCssHead = null
	let currentCssNode = null
	let currentCssText = ''

	return (/** @type {string} */ cssText) => {
		if (typeof document === 'object') {
			if (!currentCssHead) currentCssHead = document.head || document.documentElement
			if (!currentCssNode) currentCssNode = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches' })
			if (!currentCssNode.parentNode) currentCssHead[isAppend ? 'append' : 'prepend'](currentCssNode)

			currentCssText = currentCssText || currentCssNode.textContent

			if (!cssText.split('}').every((rule) => currentCssText.includes(rule))) {
				currentCssNode.textContent = currentCssText = cssText
			}
		}
	}
}
