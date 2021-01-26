/**
 * Returns selectors resolved from parent selectors and nested selectors.
 * @param {string[]} parentSelectors - Parent selectors (e.g. '["a", "button"]`).
 * @param {string[]} nestedSelectors - Nested selectors (e.g. `["&:hover", "&:focus"]`).
 */
const getResolvedSelectors = (parentSelectors, nestedSelectors) =>
	parentSelectors.reduce((resolvedSelectors, parentSelector) => {
		resolvedSelectors.push(
			...nestedSelectors.map((selector) =>
				selector.replace(/(^[^&]*)(&)([^]*$)|(^_+)([^]*$)|^[^]*$/, (plain, beforeNesting, duringNesting, afterNesting, duringPseudo, afterPseudo) =>
					duringNesting ? beforeNesting + parentSelector + afterNesting : duringPseudo ? parentSelector + ':'.repeat(duringPseudo.length) + afterPseudo : parentSelector + ' ' + plain
				)
			)
		)
		return resolvedSelectors
	}, [])

export default getResolvedSelectors
