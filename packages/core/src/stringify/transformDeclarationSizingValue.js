/** Returns a declaration sizing value with polyfilled sizing keywords. */
export default (
	/** @type {string} Declaration name. */
	name,
	/** @type {string} Declaration value. */
	value
) => value.replace(
	/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,
	(data, lead, main, tail) => (
		lead + (
			main === 'stretch'
				? `-moz-available${tail};${name}:${lead}-webkit-fill-available`
			: `-moz-fit-content${tail};${name}:${lead}fit-content`
		) + tail
	),
) // prettier-ignore
