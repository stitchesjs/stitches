const prefixLast1 = {
	appearance: () => (d) => ({ WebkitAppearance: d, appearance: d }),
	backfaceVisibility: () => (d) => ({ WebkitBackfaceVisibility: d, backfaceVisibility: d }),
	backgroundClip: () => (d) => ({ WebkitBackgroundClip: d, backgroundClip: d }),
	clipPath: () => (d) => ({ WebkitClipPath: d, clipPath: d }),
	hypens: () => (d) => ({ WebkitHypens: d, hypens: d }),
	maskImage: () => (d) => ({ WebkitMaskImage: d, maskImage: d }),
	tabSize: () => (d) => ({ MozTabSize: d, tabSize: d }),
	userSelect: () => (d) => ({ WebkitAppearance: d, userSelect: d }),
}

export default prefixLast1
