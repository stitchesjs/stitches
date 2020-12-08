/** CSS Properties and the their associated theme scale tokens. */
const cssPropToToken = {
	// use "borderStyles" tokens
	borderBottomStyle: 'borderStyles',
	borderLeftStyle: 'borderStyles',
	borderRightStyle: 'borderStyles',
	borderStyle: 'borderStyles',
	borderTopStyle: 'borderStyles',

	// use "borderWidths" tokens
	borderBottomWidth: 'borderWidths',
	borderLeftWidth: 'borderWidths',
	borderRightWidth: 'borderWidths',
	borderTopWidth: 'borderWidths',
	borderWidth: 'borderWidths',

	// use "colors" tokens
	backgroundColor: 'colors',
	borderBottomColor: 'colors',
	borderColor: 'colors',
	borderLeftColor: 'colors',
	borderRightColor: 'colors',
	borderTopColor: 'colors',
	caretColor: 'colors',
	color: 'colors',
	columnRuleColor: 'colors',
	fill: 'colors',
	outlineColor: 'colors',
	stroke: 'colors',
	textDecorationColor: 'color',

	// use "fontSizes" tokens
	fontSize: 'fontSizes',

	// use "fonts" tokens
	fontFamily: 'fonts',

	// use "fontWeights" tokens
	fontWeight: 'fontWeights',
	lineHeight: 'lineHeights',

	// use "letterSpacings" tokens
	letterSpacing: 'letterSpacings',

	// use "radii" tokens
	borderRadius: 'radii',
	borderTopLeftRadius: 'radii',
	borderTopRightRadius: 'radii',
	borderBottomRightRadius: 'radii',
	borderBottomLeftRadius: 'radii',

	// use "sizes" tokens
	blockSize: 'sizes',
	flexBasis: 'sizes',
	height: 'sizes',
	inlineSize: 'sizes',
	maxBlockSize: 'sizes',
	maxHeight: 'sizes',
	maxInlineSize: 'sizes',
	maxWidth: 'sizes',
	minBlockSize: 'sizes',
	minHeight: 'sizes',
	minInlineSize: 'sizes',
	minWidth: 'sizes',
	width: 'sizes',

	// use "space" tokens
	bottom: 'space',
	columnGap: 'space',
	gap: 'space',
	gridColumnGap: 'space',
	gridGap: 'space',
	gridRowGap: 'space',
	inset: 'space',
	insetBlock: 'space',
	insetBlockEnd: 'space',
	insetBlockStart: 'space',
	insetInline: 'space',
	insetInlineEnd: 'space',
	insetInlineStart: 'space',
	left: 'space',
	margin: 'space',
	marginBlock: 'space',
	marginBlockEnd: 'space',
	marginBlockStart: 'space',
	marginBottom: 'space',
	marginInline: 'space',
	marginInlineEnd: 'space',
	marginInlineStart: 'space',
	marginLeft: 'space',
	marginRight: 'space',
	marginTop: 'space',
	padding: 'space',
	paddingBlock: 'space',
	paddingBlockEnd: 'space',
	paddingBlockStart: 'space',
	paddingBottom: 'space',
	paddingInline: 'space',
	paddingInlineEnd: 'space',
	paddingInlineStart: 'space',
	paddingLeft: 'space',
	paddingRight: 'space',
	paddingTop: 'space',
	right: 'space',
	rowGap: 'space',
	top: 'space',

	// use "shadows" tokens
	boxShadow: 'shadows',
	textShadow: 'shadows',

	// use "transitions" tokens
	transition: 'transitions',

	// use "zIndices" tokens
	zIndex: 'zIndices',
} as const

type CssPropToToken = typeof cssPropToToken

export { cssPropToToken, CssPropToToken }
