const splitBySpace = /\s+(?![^()]*\))/
const split = (fn) => () => (data) => fn(...String(data).split(splitBySpace))

const logicalProperties = {
	inset: split((t, r, b, l) => ({ top: t, right: r || t, bottom: b || t, left: l || r || t })),
	insetBlock: split((s, e) => ({ top: s, bottom: e || s })),
	insetBlockEnd: () => (e) => ({ bottom: e }),
	insetBlockStart: () => (s) => ({ top: s }),
	insetInline: split((s, e) => (s === e ? { left: s, right: e } : { insetInlineStart: s, insetInlineEnd: e })),
	insetInlineEnd: () => (e) => ({ ':where([dir="ltr"]) &': { right: e }, ':where([dir="rtl"]) &': { left: e } }),
	insetInlineStart: () => (s) => ({ ':where([dir="ltr"]) &': { left: s }, ':where([dir="rtl"]) &': { right: s } }),
	marginBlock: split((s, e) => ({ marginBlockStart: s, marginBlockEnd: e || s })),
	marginInline: split((s, e) => ({ marginInlineStart: s, marginInlineEnd: e || s })),
	maxSize: split((b, i) => ({ maxBlockSize: b, maxInlineSize: i || b })),
	minSize: split((b, i) => ({ minBlockSize: b, minInlineSize: i || b })),
	paddingBlock: split((s, e) => ({ paddingBlockStart: s, paddingBlockEnd: e || s })),
	paddingInline: split((s, e) => ({ paddingInlineStart: s, paddingInlineEnd: e || s })),
	size: split((b, i) => ({ blockSize: b, inlineSize: i || b })),
}

export default logicalProperties
