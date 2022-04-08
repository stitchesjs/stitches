export const getNonce = () => {
	if (typeof window.__webpack_nonce__ !== 'undefined') return window.__webpack_nonce__
	if (typeof window.nonce !== 'undefined') return window.nonce
	return null
}
