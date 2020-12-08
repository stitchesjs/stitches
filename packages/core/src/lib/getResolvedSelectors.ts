/** Returns selectors resolved from parent selectors and nested selectors. */
const getResolvedSelectors = (
	/** Parent selectors (e.g. `["a", "button"]`). */
	parentSelectors: string[],
	/** Nested selectors (e.g. `["&:hover", "&:focus"]`). */
	nestedSelectors: string[],
) =>
	parentSelectors.reduce((resolvedSelectors, parentSelector) => {
		resolvedSelectors.push(
			...nestedSelectors.map(childSelector =>
				/&/.test(childSelector)
					? childSelector.replace(/&/, parentSelector)
					: childSelector.replace(/^/, parentSelector + ' '),
			),
		);
		return resolvedSelectors;
	}, [] as string[]);

export default getResolvedSelectors;
