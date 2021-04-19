import { assign } from './Object.js'

export default (init) => {
	const insertionMethod = init.insertionMethod === 'append' ? 'append' : 'prepend'

	const hasDocument = typeof document === 'object'

	const currentCssHead = hasDocument ? document.head || document.documentElement : null

	const currentCssNode = hasDocument ? document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches' }) : { isConnected: true, firstChild: { data: '' } }

	const currentCssText = hasDocument ? currentCssNode.appendChild(new Text()) : { data: '' }

	init.ssrText = currentCssNode.firstChild.data

	return (/** @type {string} */ cssText) => {
		if (!currentCssNode.isConnected) currentCssHead[insertionMethod](currentCssNode)

		currentCssText.data = cssText
	}
}
