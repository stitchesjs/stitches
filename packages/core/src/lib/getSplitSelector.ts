const getSplitSelector = (selector: string) =>
	selector.split(/\s*,\s*/).map(part => part.replace(/^_+/, pseudo => ':'.repeat(pseudo.length)))

export default getSplitSelector
