import { assign } from './Object.js'

export default (init) => {
	let currentCssHead = null
	let currentCssNode = null
	let hasExistingCss = false

	const isAppend = init.insertionMethod === 'append'

	const getText = (cssText) => {
		if (!currentCssHead) currentCssHead = document.head || document.documentElement
		if (!currentCssNode) currentCssNode = (hasExistingCss = document.getElementById('stitches')) || assign(document.createElement('style'), { id: 'stitches', textContent: cssText })
		if (!currentCssNode.parentNode) currentCssHead[isAppend ? 'append' : 'prepend'](currentCssNode)
		const returnValue = currentCssNode.textContent
		if (typeof hasExistingCss === 'object') hasExistingCss = returnValue
		return returnValue
	}

	return (/** @type {string} */ cssText) => {
		// only update if the document is available
		if (typeof document === 'object') {
			const oldText = getText()

			// prettier-ignore
			if (
				// update when there is no existing css
				!oldText
				|| (
					// or when the css has changed, and
					oldText !== cssText
					&& (
						// there was no existing css, or
						!hasExistingCss
						// was existing css and the document is loaded
						|| document.readyState == 'complete'
					)
				)
			) currentCssNode.textContent = cssText
		}
	}
}
