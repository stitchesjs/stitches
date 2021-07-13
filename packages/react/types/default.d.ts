/* CreateCss Interfaces */
/* ========================================================================== */

/** Default Prefix configuration. */
export type Prefix = ''

/** Default Media configuration. */
export type Media = { all: string }

/** Default Theme. */
export type Theme = {
	borderStyles?: ThemeScale
	borderWidths?: ThemeScale
	colors?: ThemeScale
	fonts?: ThemeScale
	fontSizes?: ThemeScale
	fontWeights?: ThemeScale
	letterSpacings?: ThemeScale
	lineHeights?: ThemeScale
	radii?: ThemeScale
	shadows?: ThemeScale
	sizes?: ThemeScale
	space?: ThemeScale
	transitions?: ThemeScale
	zIndices?: ThemeScale
}

/** Default Theme Scale. */
type ThemeScale = {
	[token in number | string]: boolean | number | string
}

/** Default ThemeMap configuration. */
export interface ThemeMap {
	gap: 'space'
	gridGap: 'space'
	columnGap: 'space'
	gridColumnGap: 'space'
	rowGap: 'space'
	gridRowGap: 'space'
	inset: 'space'
	insetBlock: 'space'
	insetBlockEnd: 'space'
	insetBlockStart: 'space'
	insetInline: 'space'
	insetInlineEnd: 'space'
	insetInlineStart: 'space'
	margin: 'space'
	marginTop: 'space'
	marginRight: 'space'
	marginBottom: 'space'
	marginLeft: 'space'
	marginBlock: 'space'
	marginBlockEnd: 'space'
	marginBlockStart: 'space'
	marginInline: 'space'
	marginInlineEnd: 'space'
	marginInlineStart: 'space'
	padding: 'space'
	paddingTop: 'space'
	paddingRight: 'space'
	paddingBottom: 'space'
	paddingLeft: 'space'
	paddingBlock: 'space'
	paddingBlockEnd: 'space'
	paddingBlockStart: 'space'
	paddingInline: 'space'
	paddingInlineEnd: 'space'
	paddingInlineStart: 'space'
	scrollPadding: 'space'
	scrollPaddingTop: 'space'
	scrollPaddingRight: 'space'
	scrollPaddingBottom: 'space'
	scrollPaddingLeft: 'space'
	scrollPaddingBlock: 'space'
	scrollPaddingBlockEnd: 'space'
	scrollPaddingBlockStart: 'space'
	scrollPaddingInline: 'space'
	scrollPaddingInlineEnd: 'space'
	scrollPaddingInlineStart: 'space'
	top: 'space'
	right: 'space'
	bottom: 'space'
	left: 'space'

	fontSize: 'fontSizes'

	background: 'colors'
	backgroundColor: 'colors'
	backgroundImage: 'colors'
	border: 'colors'
	borderBlock: 'colors'
	borderBlockEnd: 'colors'
	borderBlockStart: 'colors'
	borderBottom: 'colors'
	borderBottomColor: 'colors'
	borderColor: 'colors'
	borderInline: 'colors'
	borderInlineEnd: 'colors'
	borderInlineStart: 'colors'
	borderLeft: 'colors'
	borderLeftColor: 'colors'
	borderRight: 'colors'
	borderRightColor: 'colors'
	borderTop: 'colors'
	borderTopColor: 'colors'
	caretColor: 'colors'
	color: 'colors'
	columnRuleColor: 'colors'
	outline: 'colors'
	outlineColor: 'colors'
	fill: 'colors'
	stroke: 'colors'
	textDecorationColor: 'colors'

	fontFamily: 'fonts'

	fontWeight: 'fontWeights'
	lineHeight: 'lineHeights'

	letterSpacing: 'letterSpacings'

	blockSize: 'sizes'
	minBlockSize: 'sizes'
	maxBlockSize: 'sizes'
	inlineSize: 'sizes'
	minInlineSize: 'sizes'
	maxInlineSize: 'sizes'
	width: 'sizes'
	minWidth: 'sizes'
	maxWidth: 'sizes'
	height: 'sizes'
	minHeight: 'sizes'
	maxHeight: 'sizes'
	flexBasis: 'sizes'
	gridTemplateColumns: 'sizes'
	gridTemplateRows: 'sizes'

	borderWidth: 'borderWidths'
	borderTopWidth: 'borderWidths'
	borderLeftWidth: 'borderWidths'
	borderRightWidth: 'borderWidths'
	borderBottomWidth: 'borderWidths'

	borderStyle: 'borderStyles'
	borderTopStyle: 'borderStyles'
	borderLeftStyle: 'borderStyles'
	borderRightStyle: 'borderStyles'
	borderBottomStyle: 'borderStyles'

	borderRadius: 'radii'
	borderTopLeftRadius: 'radii'
	borderTopRightRadius: 'radii'
	borderBottomRightRadius: 'radii'
	borderBottomLeftRadius: 'radii'

	boxShadow: 'shadows'
	textShadow: 'shadows'

	transition: 'transitions'

	zIndex: 'zIndices'
}

/** Default Utilities configuration. */
export type Utils = {
	[property: string]: (value: unknown) => {}
}
