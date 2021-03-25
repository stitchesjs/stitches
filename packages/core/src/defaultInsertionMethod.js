import { assign } from './Object.js'

export default (init) => {
	let isSsrCssRemoved = false

	let currentCssHead
	let currentCssNode
	let currentSsrText
	let currentHotText
	let visibilityWait

	const insertionMethod = init.insertionMethod === 'append' ? 'append' : 'prepend'

	return (/** @type {string} */ cssText) => {
		// only update if the document is available
		if (typeof document === 'object') {
			// use the document head or the document root
			if (!currentCssHead) currentCssHead = document.head || document.documentElement

			// use the existing stitches style element, otherwise create one
			if (!currentCssNode) currentCssNode = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches', textContent: cssText })

			// use the prerendered stitches style text, otherwise create one outside of the document
			if (!currentSsrText) {
				currentSsrText = currentCssNode.firstChild || new Text()

				isSsrCssRemoved = !currentSsrText.data
			}

			// use a new stitches style text for hot-loaded styles
			if (!currentHotText) currentHotText = currentCssNode.insertBefore(new Text(), currentSsrText)

			// attach the stitches style element to the document if it not already connected
			if (!currentCssNode.isConnected) currentCssHead[insertionMethod](currentCssNode)

			currentHotText.data = cssText

			// remove the prerendered stiches style text once the document is visible
			if (!isSsrCssRemoved && cssText) {
				clearTimeout(visibilityWait)

				visibilityWait = setTimeout(() => {
					currentSsrText.remove()

					isSsrCssRemoved = true
				}, 250)
			}
		}
	}
}
