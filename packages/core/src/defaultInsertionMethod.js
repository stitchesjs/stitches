import { assign } from './Object.js'

export default (init) => {
	let currentCssHead = null
	let currentCssNode = null
	let currentCssWait = null

	const isAppend = init.insertionMethod === 'append'

	const getText = (cssText) => {
		if (!currentCssHead) currentCssHead = document.head || document.documentElement
		if (!currentCssNode) currentCssNode = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches', textContent: cssText })
		if (!currentCssNode.parentNode) currentCssHead[isAppend ? 'append' : 'prepend'](currentCssNode)
		return currentCssNode.textContent
	}

	return (/** @type {string} */ cssText) => {
		// only update if the document is available
		if (typeof document === 'object') {
			cancelAnimationFrame(currentCssWait)

			const oldText = getText()

			if (!oldText) currentCssNode.textContent = cssText
			else if (oldText !== cssText && document.readyState == 'complete') currentCssWait = requestAnimationFrame(() => (currentCssNode.textContent = cssText))
		}
	}
}
