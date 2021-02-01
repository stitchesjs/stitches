/** Returns selectors resolved from parent selectors and nested selectors. */
const getResolvedSelectors = (
	/** Parent selectors (e.g. '["a", "button"]`). */
	parentSelectors,
	/** Nested selectors (e.g. `["&:hover", "&:focus"]`). */
	nestedSelectors,
) =>
	parentSelectors.reduce((resolvedSelectors, parentSelector) => {
		resolvedSelectors.push(
			...nestedSelectors.map((selector) =>
				selector.replace(/(^[^&]*)(&)([^]*$)|(^_+)([^]*$)|^[^]*$/, (plain, beforeNesting, duringNesting, afterNesting, duringPseudo, afterPseudo) =>
					duringNesting ? beforeNesting + parentSelector + afterNesting : duringPseudo ? parentSelector + ':'.repeat(duringPseudo.length) + afterPseudo : parentSelector + ' ' + plain,
				),
			),
		)
		return resolvedSelectors
	}, [])

export default getResolvedSelectors
