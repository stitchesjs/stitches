/** Returns selectors resolved from parent selectors and nested selectors. */
const getResolvedSelectors = (
	/** Parent selectors (e.g. `["a", "button"]`). */
	parentSelectors,
	/** Nested selectors (e.g. `["&:hover", "&:focus"]`). */
	nestedSelectors,
) =>
	parentSelectors.reduce((resolvedSelectors, parentSelector) => {
		resolvedSelectors.push(...nestedSelectors.map(
			(selector) => (
				/[ +>|~]/.test(parentSelector) && /&[^]*&/.test(selector)
					? selector.replace(/&/g, `:is(${parentSelector})`)
				: /&/.test(selector)
					? selector.replace(/&/g, parentSelector)
					: selector.replace(/^/, parentSelector + ' ')
			)
		))
		return resolvedSelectors
	}, [])

export default getResolvedSelectors
