const splitBySpace = /\s+(?![^()]*\))/
const split = (fn) => (data) => fn(...(typeof data === 'string' ? String(data).split(splitBySpace) : [data]))

export const toPolyfilledValue = {
	// prefixed properties
	appearance: (d) => ({ WebkitAppearance: d, appearance: d }),
	backfaceVisibility: (d) => ({ WebkitBackfaceVisibility: d, backfaceVisibility: d }),
	backdropFilter: (d) => ({ WebkitBackdropFilter: d, backdropFilter: d }),
	backgroundClip: (d) => ({ WebkitBackgroundClip: d, backgroundClip: d }),
	boxDecorationBreak: (d) => ({ WebkitBoxDecorationBreak: d, boxDecorationBreak: d }),
	clipPath: (d) => ({ WebkitClipPath: d, clipPath: d }),
	content: (d) => ({ content: d.includes('"') || d.includes("'") || /^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(d) ? d : `"${d}"` }),
	hyphens: (d) => ({ WebkitHyphens: d, hyphens: d }),
	maskImage: (d) => ({ WebkitMaskImage: d, maskImage: d }),
	maskSize: (d) => ({ WebkitMaskSize: d, maskSize: d }),
	tabSize: (d) => ({ MozTabSize: d, tabSize: d }),
	textSizeAdjust: (d) => ({ WebkitTextSizeAdjust: d, textSizeAdjust: d }),
	userSelect: (d) => ({ WebkitUserSelect: d, userSelect: d }),

	// logical properties
	marginBlock: split((s, e) => ({ marginBlockStart: s, marginBlockEnd: e || s })),
	marginInline: split((s, e) => ({ marginInlineStart: s, marginInlineEnd: e || s })),
	maxSize: split((b, i) => ({ maxBlockSize: b, maxInlineSize: i || b })),
	minSize: split((b, i) => ({ minBlockSize: b, minInlineSize: i || b })),
	paddingBlock: split((s, e) => ({ paddingBlockStart: s, paddingBlockEnd: e || s })),
	paddingInline: split((s, e) => ({ paddingInlineStart: s, paddingInlineEnd: e || s })),
}
