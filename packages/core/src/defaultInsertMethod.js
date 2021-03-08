export default (/** @type {boolean} */ isAppend) => {
	let currentCssHead = null
	let currentCssNode = null

	return (/** @type {string} */ cssText) => {
		if (typeof document === 'object') {
			if (!currentCssHead) currentCssHead = document.head || document.documentElement
			if (!currentCssNode) currentCssNode = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches' })
			if (!currentCssNode.parentNode) currentCssHead[isAppend ? 'append' : 'prepend'](currentCssNode)

			currentCssNode.textContent = cssText
		}
	}
}
