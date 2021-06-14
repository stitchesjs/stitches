const borderStyles = 'borderStyles'
const borderWidths = 'borderWidths'
const colors = 'colors'
const fonts = 'fonts'
const fontSizes = 'fontSizes'
const fontWeights = 'fontWeights'
const letterSpacings = 'letterSpacings'
const lineHeights = 'lineHeights'
const radii = 'radii'
const shadows = 'shadows'
const sizes = 'sizes'
const space = 'space'
const transitions = 'transitions'
const zIndices = 'zIndices'

/** @type {DefaultThemeMap} */
export const defaultThemeMap = {
	gap: space,
	gridGap: space,
	columnGap: space,
	gridColumnGap: space,
	rowGap: space,
	gridRowGap: space,
	inset: space,
	insetBlock: space,
	insetBlockEnd: space,
	insetBlockStart: space,
	insetInline: space,
	insetInlineEnd: space,
	insetInlineStart: space,
	margin: space,
	marginTop: space,
	marginRight: space,
	marginBottom: space,
	marginLeft: space,
	marginBlock: space,
	marginBlockEnd: space,
	marginBlockStart: space,
	marginInline: space,
	marginInlineEnd: space,
	marginInlineStart: space,
	padding: space,
	paddingTop: space,
	paddingRight: space,
	paddingBottom: space,
	paddingLeft: space,
	paddingBlock: space,
	paddingBlockEnd: space,
	paddingBlockStart: space,
	paddingInline: space,
	paddingInlineEnd: space,
	paddingInlineStart: space,
	top: space,
	right: space,
	bottom: space,
	left: space,
	scrollMargin: space,
	scrollMarginTop: space,
	scrollMarginRight: space,
	scrollMarginBottom: space,
	scrollMarginLeft: space,
	scrollMarginX: space,
	scrollMarginY: space,
	scrollMarginBlock: space,
	scrollMarginBlockEnd: space,
	scrollMarginBlockStart: space,
	scrollMarginInline: space,
	scrollMarginInlineEnd: space,
	scrollMarginInlineStart: space,
	scrollPadding: space,
	scrollPaddingTop: space,
	scrollPaddingRight: space,
	scrollPaddingBottom: space,
	scrollPaddingLeft: space,
	scrollPaddingX: space,
	scrollPaddingY: space,
	scrollPaddingBlock: space,
	scrollPaddingBlockEnd: space,
	scrollPaddingBlockStart: space,
	scrollPaddingInline: space,
	scrollPaddingInlineEnd: space,
	scrollPaddingInlineStart: space,

	fontSize: fontSizes,

	background: colors,
	backgroundColor: colors,
	backgroundImage: colors,
	border: colors,
	borderBlock: colors,
	borderBlockEnd: colors,
	borderBlockStart: colors,
	borderBottom: colors,
	borderBottomColor: colors,
	borderColor: colors,
	borderInline: colors,
	borderInlineEnd: colors,
	borderInlineStart: colors,
	borderLeft: colors,
	borderLeftColor: colors,
	borderRight: colors,
	borderRightColor: colors,
	borderTop: colors,
	borderTopColor: colors,
	caretColor: colors,
	color: colors,
	columnRuleColor: colors,
	fill: colors,
	outline: colors,
	outlineColor: colors,
	stroke: colors,
	textDecorationColor: colors,

	fontFamily: fonts,

	fontWeight: fontWeights,

	lineHeight: lineHeights,

	letterSpacing: letterSpacings,

	blockSize: sizes,
	minBlockSize: sizes,
	maxBlockSize: sizes,
	inlineSize: sizes,
	minInlineSize: sizes,
	maxInlineSize: sizes,
	width: sizes,
	minWidth: sizes,
	maxWidth: sizes,
	height: sizes,
	minHeight: sizes,
	maxHeight: sizes,
	flexBasis: sizes,
	gridTemplateColumns: sizes,
	gridTemplateRows: sizes,

	borderWidth: borderWidths,
	borderTopWidth: borderWidths,
	borderRightWidth: borderWidths,
	borderBottomWidth: borderWidths,
	borderLeftWidth: borderWidths,

	borderStyle: borderStyles,
	borderTopStyle: borderStyles,
	borderRightStyle: borderStyles,
	borderBottomStyle: borderStyles,
	borderLeftStyle: borderStyles,

	borderRadius: radii,
	borderTopLeftRadius: radii,
	borderTopRightRadius: radii,
	borderBottomRightRadius: radii,
	borderBottomLeftRadius: radii,

	boxShadow: shadows,
	textShadow: shadows,

	transition: transitions,

	zIndex: zIndices,
}

/**
 * @typedef {Object} DefaultThemeMap
 * @property {space} gap
 * @property {space} gridGap
 * @property {space} columnGap
 * @property {space} gridColumnGap
 * @property {space} rowGap
 * @property {space} gridRowGap
 * @property {space} inset
 * @property {space} insetBlock
 * @property {space} insetBlockEnd
 * @property {space} insetBlockStart
 * @property {space} insetInline
 * @property {space} insetInlineEnd
 * @property {space} insetInlineStart
 * @property {space} margin
 * @property {space} marginTop
 * @property {space} marginRight
 * @property {space} marginBottom
 * @property {space} marginLeft
 * @property {space} marginBlock
 * @property {space} marginBlockEnd
 * @property {space} marginBlockStart
 * @property {space} marginInline
 * @property {space} marginInlineEnd
 * @property {space} marginInlineStart
 * @property {space} padding
 * @property {space} paddingTop
 * @property {space} paddingRight
 * @property {space} paddingBottom
 * @property {space} paddingLeft
 * @property {space} paddingBlock
 * @property {space} paddingBlockEnd
 * @property {space} paddingBlockStart
 * @property {space} paddingInline
 * @property {space} paddingInlineEnd
 * @property {space} paddingInlineStart
 * @property {space} top
 * @property {space} right
 * @property {space} bottom
 * @property {space} left
 * @property {space} scrollMargin
 * @property {space} scrollMarginTop
 * @property {space} scrollMarginRight
 * @property {space} scrollMarginBottom
 * @property {space} scrollMarginLeft
 * @property {space} scrollMarginX
 * @property {space} scrollMarginY
 * @property {space} scrollMarginBlock
 * @property {space} scrollMarginBlockEnd
 * @property {space} scrollMarginBlockStart
 * @property {space} scrollMarginInline
 * @property {space} scrollMarginInlineEnd
 * @property {space} scrollMarginInlineStart
 * @property {space} scrollPadding
 * @property {space} scrollPaddingTop
 * @property {space} scrollPaddingRight
 * @property {space} scrollPaddingBottom
 * @property {space} scrollPaddingLeft
 * @property {space} scrollPaddingX
 * @property {space} scrollPaddingY
 * @property {space} scrollPaddingBlock
 * @property {space} scrollPaddingBlockEnd
 * @property {space} scrollPaddingBlockStart
 * @property {space} scrollPaddingInline
 * @property {space} scrollPaddingInlineEnd
 * @property {space} scrollPaddingInlineStart

 * @property {fontSizes} fontSize

 * @property {colors} background
 * @property {colors} backgroundColor
 * @property {colors} backgroundImage
 * @property {colors} border
 * @property {colors} borderBlock
 * @property {colors} borderBlockEnd
 * @property {colors} borderBlockStart
 * @property {colors} borderBottom
 * @property {colors} borderBottomColor
 * @property {colors} borderColor
 * @property {colors} borderInline
 * @property {colors} borderInlineEnd
 * @property {colors} borderInlineStart
 * @property {colors} borderLeft
 * @property {colors} borderLeftColor
 * @property {colors} borderRight
 * @property {colors} borderRightColor
 * @property {colors} borderTop
 * @property {colors} borderTopColor
 * @property {colors} caretColor
 * @property {colors} color
 * @property {colors} columnRuleColor
 * @property {colors} fill
 * @property {colors} outline
 * @property {colors} outlineColor
 * @property {colors} stroke
 * @property {colors} textDecorationColor

 * @property {fonts} fontFamily

 * @property {fontWeights} fontWeight

 * @property {lineHeights} lineHeight

 * @property {letterSpacings} letterSpacing

 * @property {sizes} blockSize
 * @property {sizes} minBlockSize
 * @property {sizes} maxBlockSize
 * @property {sizes} inlineSize
 * @property {sizes} minInlineSize
 * @property {sizes} maxInlineSize
 * @property {sizes} width
 * @property {sizes} minWidth
 * @property {sizes} maxWidth
 * @property {sizes} height
 * @property {sizes} minHeight
 * @property {sizes} maxHeight
 * @property {sizes} flexBasis
 * @property {sizes} gridTemplateColumns
 * @property {sizes} gridTemplateRows

 * @property {borderWidths} borderWidth
 * @property {borderWidths} borderTopWidth
 * @property {borderWidths} borderRightWidth
 * @property {borderWidths} borderBottomWidth
 * @property {borderWidths} borderLeftWidth

 * @property {borderStyles} borderStyle
 * @property {borderStyles} borderTopStyle
 * @property {borderStyles} borderRightStyle
 * @property {borderStyles} borderBottomStyle
 * @property {borderStyles} borderLeftStyle

 * @property {radii} borderRadius
 * @property {radii} borderTopLeftRadius
 * @property {radii} borderTopRightRadius
 * @property {radii} borderBottomRightRadius
 * @property {radii} borderBottomLeftRadius

 * @property {shadows} boxShadow
 * @property {shadows} textShadow

 * @property {transitions} transition

 * @property {zIndices} zIndex
 */
