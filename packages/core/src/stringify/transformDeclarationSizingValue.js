/** CSS Properties whose value include a sizing keyword. */
export const sizeProps = {
	blockSize: 1,
	height: 1,
	inlineSize: 1,
	maxBlockSize: 1,
	maxHeight: 1,
	maxInlineSize: 1,
	maxWidth: 1,
	minBlockSize: 1,
	minHeight: 1,
	minInlineSize: 1,
	minWidth: 1,
	width: 1,
}

/** Returns a declaration sizing value with polyfilled sizing keywords. */
export const transformDeclarationSizingValue = (
	/** @type {string} Declaration name. */
	name,
	/** @type {string} Declaration value. */
	value
) => name in sizeProps ? value.replace(
	/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,
	(data, lead, main, tail) => (
		lead + (
			main === 'stretch'
				? `-moz-available${tail};${name}:${lead}-webkit-fill-available`
			: `-moz-fit-content${tail};${name}:${lead}fit-content`
		) + tail
	),
) : value // prettier-ignore
