import { CSSGlobalValue } from './CSSGlobalValue'
import { Config } from '../createCss'
import { CSSNamedColor } from './CSSNamedColor'
import { PlainObject } from '../utility'

// [ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>

export type CSSDisplayValue = `${CSSDisplayOutside} ${CSSDisplayInside}` | `${CSSDisplayInside} ${CSSDisplayOutside}` | CSSDisplayInternal | CSSDisplayBox | CSSDisplayLegacy
export type CSSDisplayOutside = 'block' | 'inline' | 'run-in'
export type CSSDisplayInside = 'flow' | 'flow-root' | 'table' | 'flex' | 'grid' | 'ruby'
export type CSSDisplayInternal = 'table-row-group' | 'table-header-group' | 'table-footer-group' | 'table-row' | 'table-cell' | 'table-column-group' | 'table-column' | 'table-caption' | 'ruby-base' | 'ruby-text' | 'ruby-base-container' | 'ruby-text-container' // prettier-ignore
export type CSSDisplayBox = 'contents' | 'none'
export type CSSDisplayLegacy = 'auto' | 'inline-block' | 'inline-list-item' | 'inline-table' | 'inline-flex' | 'inline-grid'
export type CSSSizingValue = 'min-content' | 'max-content' | 'fit-content' | 'stretch'

export type CSSProperties<C extends Config = Config, T extends PlainObject = {}> = {
	/**
	 * Specifies the distribution of space between and around content items along the flexbox's cross-axis or a grid's block axis.
	 *
	 * **Initial value**: `normal`
	 */
	alignContent: CSSGlobalValue | ThemeValue<C, 'alignContent'>
	/**
	 * Specifies the `align-self` value on all direct children as a group.
	 *
	 * **Initial value**: `normal`
	 */
	alignItems: CSSGlobalValue | ThemeValue<C, 'alignItems'>
	/**
	 * Specifies the overriding grid or flex item's `align-items` value.
	 *
	 * **Initial value**: `normal`
	 */
	alignSelf: CSSGlobalValue | ThemeValue<C, 'alignSelf'>
	/**
	 * Specifies the resetting of all the element's properties, except `unicode-bidi`, `direction`, and any CSS Custom Properties.
	 *
	 * **Initial value**: no initial value
	 */
	all: CSSGlobalValue | ThemeValue<C, 'all'>
	animation: CSSGlobalValue | ThemeValue<C, 'animation'>
	animationDelay: CSSGlobalValue | ThemeValue<C, 'animationDelay'>
	animationDirection: CSSGlobalValue | ThemeValue<C, 'animationDirection'>
	animationDuration: CSSGlobalValue | ThemeValue<C, 'animationDuration'>
	animationFillMode: CSSGlobalValue | ThemeValue<C, 'animationFillMode'>
	animationIterationCount: CSSGlobalValue | ThemeValue<C, 'animationIterationCount'>
	animationName: CSSGlobalValue | ThemeValue<C, 'animationName'>
	animationPlayState: CSSGlobalValue | ThemeValue<C, 'animationPlayState'>
	animationTimingFunction: CSSGlobalValue | ThemeValue<C, 'animationTimingFunction'>
	/**
	 * Specifies the display of the element using platform-native styling, based on the operating system's theme.
	 *
	 * **Initial value**: `auto`
	 */
	appearance: CSSGlobalValue | ThemeValue<C, 'appearance'>
	aspectRatio: CSSGlobalValue | ThemeValue<C, 'aspectRatio'>
	backfaceVisibility: CSSGlobalValue | ThemeValue<C, 'backfaceVisibility'>
	background: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'background'>
	backgroundAttachment: CSSGlobalValue | ThemeValue<C, 'backgroundAttachment'>
	backgroundBlendMode: CSSGlobalValue | ThemeValue<C, 'backgroundBlendMode'>
	backgroundClip: CSSGlobalValue | ThemeValue<C, 'backgroundClip'>
	/**
	 * Specifies the background color of an element.
	 *
	 * **Initial value**: `transparent`
	 */
	backgroundColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'backgroundColor'>
	backgroundImage: CSSGlobalValue | ThemeValue<C, 'backgroundImage'>
	backgroundOrigin: CSSGlobalValue | ThemeValue<C, 'backgroundOrigin'>
	backgroundPosition: CSSGlobalValue | ThemeValue<C, 'backgroundPosition'>
	backgroundRepeat: CSSGlobalValue | ThemeValue<C, 'backgroundRepeat'>
	backgroundSize: CSSGlobalValue | ThemeValue<C, 'backgroundSize'>
	baselineShift: CSSGlobalValue | ThemeValue<C, 'baselineShift'>
	baselineSource: CSSGlobalValue | ThemeValue<C, 'baselineSource'>
	blockEllipsis: CSSGlobalValue | ThemeValue<C, 'blockEllipsis'>
	blockSize: CSSGlobalValue | ThemeValue<C, 'blockSize'>
	blockStep: CSSGlobalValue | ThemeValue<C, 'blockStep'>
	blockStepAlign: CSSGlobalValue | ThemeValue<C, 'blockStepAlign'>
	blockStepInsert: CSSGlobalValue | ThemeValue<C, 'blockStepInsert'>
	blockStepRound: CSSGlobalValue | ThemeValue<C, 'blockStepRound'>
	blockStepSize: CSSGlobalValue | ThemeValue<C, 'blockStepSize'>
	bookmarkLabel: CSSGlobalValue | ThemeValue<C, 'bookmarkLabel'>
	bookmarkLevel: CSSGlobalValue | ThemeValue<C, 'bookmarkLevel'>
	bookmarkState: CSSGlobalValue | ThemeValue<C, 'bookmarkState'>
	border: CSSGlobalValue | ThemeValue<C, 'border'>
	borderBlock: CSSGlobalValue | ThemeValue<C, 'borderBlock'>
	borderBlockColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderBlockColor'>
	borderBlockEnd: CSSGlobalValue | ThemeValue<C, 'borderBlockEnd'>
	borderBlockEndColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderBlockEndColor'>
	borderBlockEndStyle: CSSGlobalValue | ThemeValue<C, 'borderBlockEndStyle'>
	borderBlockEndWidth: CSSGlobalValue | ThemeValue<C, 'borderBlockEndWidth'>
	borderBlockStart: CSSGlobalValue | ThemeValue<C, 'borderBlockStart'>
	borderBlockStartColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderBlockStartColor'>
	borderBlockStartStyle: CSSGlobalValue | ThemeValue<C, 'borderBlockStartStyle'>
	borderBlockStartWidth: CSSGlobalValue | ThemeValue<C, 'borderBlockStartWidth'>
	borderBlockStyle: CSSGlobalValue | ThemeValue<C, 'borderBlockStyle'>
	borderBlockWidth: CSSGlobalValue | ThemeValue<C, 'borderBlockWidth'>
	borderBottom: CSSGlobalValue | ThemeValue<C, 'borderBottom'>
	borderBottomColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderBottomColor'>
	borderBottomLeftRadius: CSSGlobalValue | ThemeValue<C, 'borderBottomLeftRadius'>
	borderBottomRightRadius: CSSGlobalValue | ThemeValue<C, 'borderBottomRightRadius'>
	borderBottomStyle: CSSGlobalValue | ThemeValue<C, 'borderBottomStyle'>
	borderBottomWidth: CSSGlobalValue | ThemeValue<C, 'borderBottomWidth'>
	borderBoundary: CSSGlobalValue | ThemeValue<C, 'borderBoundary'>
	borderCollapse: CSSGlobalValue | ThemeValue<C, 'borderCollapse'>
	borderColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderColor'>
	borderEndEndRadius: CSSGlobalValue | ThemeValue<C, 'borderEndEndRadius'>
	borderEndStartRadius: CSSGlobalValue | ThemeValue<C, 'borderEndStartRadius'>
	borderImage: CSSGlobalValue | ThemeValue<C, 'borderImage'>
	borderImageOutset: CSSGlobalValue | ThemeValue<C, 'borderImageOutset'>
	borderImageRepeat: CSSGlobalValue | ThemeValue<C, 'borderImageRepeat'>
	borderImageSlice: CSSGlobalValue | ThemeValue<C, 'borderImageSlice'>
	borderImageSource: CSSGlobalValue | ThemeValue<C, 'borderImageSource'>
	borderImageWidth: CSSGlobalValue | ThemeValue<C, 'borderImageWidth'>
	borderInline: CSSGlobalValue | ThemeValue<C, 'borderInline'>
	borderInlineColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderInlineColor'>
	borderInlineEnd: CSSGlobalValue | ThemeValue<C, 'borderInlineEnd'>
	borderInlineEndColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderInlineEndColor'>
	borderInlineEndStyle: CSSGlobalValue | ThemeValue<C, 'borderInlineEndStyle'>
	borderInlineEndWidth: CSSGlobalValue | ThemeValue<C, 'borderInlineEndWidth'>
	borderInlineStart: CSSGlobalValue | ThemeValue<C, 'borderInlineStart'>
	borderInlineStartColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderInlineStartColor'>
	borderInlineStartStyle: CSSGlobalValue | ThemeValue<C, 'borderInlineStartStyle'>
	borderInlineStartWidth: CSSGlobalValue | ThemeValue<C, 'borderInlineStartWidth'>
	borderInlineStyle: CSSGlobalValue | ThemeValue<C, 'borderInlineStyle'>
	borderInlineWidth: CSSGlobalValue | ThemeValue<C, 'borderInlineWidth'>
	borderLeft: CSSGlobalValue | ThemeValue<C, 'borderLeft'>
	borderLeftColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderLeftColor'>
	borderLeftStyle: CSSGlobalValue | ThemeValue<C, 'borderLeftStyle'>
	borderLeftWidth: CSSGlobalValue | ThemeValue<C, 'borderLeftWidth'>
	borderRadius: CSSGlobalValue | ThemeValue<C, 'borderRadius'>
	borderRight: CSSGlobalValue | ThemeValue<C, 'borderRight'>
	borderRightColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderRightColor'>
	borderRightStyle: CSSGlobalValue | ThemeValue<C, 'borderRightStyle'>
	borderRightWidth: CSSGlobalValue | ThemeValue<C, 'borderRightWidth'>
	borderSpacing: CSSGlobalValue | ThemeValue<C, 'borderSpacing'>
	borderStartEndRadius: CSSGlobalValue | ThemeValue<C, 'borderStartEndRadius'>
	borderStartStartRadius: CSSGlobalValue | ThemeValue<C, 'borderStartStartRadius'>
	borderStyle: CSSGlobalValue | ThemeValue<C, 'borderStyle'>
	borderTop: CSSGlobalValue | ThemeValue<C, 'borderTop'>
	borderTopColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'borderTopColor'>
	borderTopLeftRadius: CSSGlobalValue | ThemeValue<C, 'borderTopLeftRadius'>
	borderTopRightRadius: CSSGlobalValue | ThemeValue<C, 'borderTopRightRadius'>
	borderTopStyle: CSSGlobalValue | ThemeValue<C, 'borderTopStyle'>
	borderTopWidth: CSSGlobalValue | ThemeValue<C, 'borderTopWidth'>
	borderWidth: CSSGlobalValue | ThemeValue<C, 'borderWidth'>
	bottom: CSSGlobalValue | ThemeValue<C, 'bottom'>
	boxDecorationBreak: CSSGlobalValue | ThemeValue<C, 'boxDecorationBreak'>
	boxShadow: CSSGlobalValue | ThemeValue<C, 'boxShadow'>
	boxSizing: CSSGlobalValue | ThemeValue<C, 'boxSizing'>
	boxSnap: CSSGlobalValue | ThemeValue<C, 'boxSnap'>
	breakAfter: CSSGlobalValue | ThemeValue<C, 'breakAfter'>
	breakBefore: CSSGlobalValue | ThemeValue<C, 'breakBefore'>
	breakInside: CSSGlobalValue | ThemeValue<C, 'breakInside'>
	captionSide: CSSGlobalValue | ThemeValue<C, 'captionSide'>
	caret: CSSGlobalValue | ThemeValue<C, 'caret'>
	caretColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'caretColor'>
	caretShape: CSSGlobalValue | ThemeValue<C, 'caretShape'>
	chains: CSSGlobalValue | ThemeValue<C, 'chains'>
	clear: CSSGlobalValue | ThemeValue<C, 'clear'>
	clip: CSSGlobalValue | ThemeValue<C, 'clip'>
	clipPath: CSSGlobalValue | ThemeValue<C, 'clipPath'>
	clipRule: CSSGlobalValue | ThemeValue<C, 'clipRule'>
	/**
	 * Specifies the foreground color value of an element's text and text decorations, and sets the `currentcolor` value.
	 *
	 * **Initial value**: no initial value
	 */
	color: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'color'>
	colorAdjust: CSSGlobalValue | ThemeValue<C, 'colorAdjust'>
	colorInterpolationFilters: CSSGlobalValue | ThemeValue<C, 'colorInterpolationFilters'>
	colorScheme: CSSGlobalValue | ThemeValue<C, 'colorScheme'>
	columnCount: CSSGlobalValue | ThemeValue<C, 'columnCount'>
	columnFill: CSSGlobalValue | ThemeValue<C, 'columnFill'>
	columnGap: CSSGlobalValue | ThemeValue<C, 'columnGap'>
	columnRule: CSSGlobalValue | ThemeValue<C, 'columnRule'>
	columnRuleColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'columnRuleColor'>
	columnRuleStyle: CSSGlobalValue | ThemeValue<C, 'columnRuleStyle'>
	columnRuleWidth: CSSGlobalValue | ThemeValue<C, 'columnRuleWidth'>
	columnSpan: CSSGlobalValue | ThemeValue<C, 'columnSpan'>
	columnWidth: CSSGlobalValue | ThemeValue<C, 'columnWidth'>
	columns: CSSGlobalValue | ThemeValue<C, 'columns'>
	contain: CSSGlobalValue | ThemeValue<C, 'contain'>
	containIntrinsicSize: CSSGlobalValue | ThemeValue<C, 'containIntrinsicSize'>
	content: CSSGlobalValue | ThemeValue<C, 'content'>
	contentVisibility: CSSGlobalValue | ThemeValue<C, 'contentVisibility'>
	continue: CSSGlobalValue | ThemeValue<C, 'continue'>
	counterIncrement: CSSGlobalValue | ThemeValue<C, 'counterIncrement'>
	counterReset: CSSGlobalValue | ThemeValue<C, 'counterReset'>
	counterSet: CSSGlobalValue | ThemeValue<C, 'counterSet'>
	cue: CSSGlobalValue | ThemeValue<C, 'cue'>
	cueAfter: CSSGlobalValue | ThemeValue<C, 'cueAfter'>
	cueBefore: CSSGlobalValue | ThemeValue<C, 'cueBefore'>
	cursor: CSSGlobalValue | ThemeValue<C, 'cursor'>
	direction: CSSGlobalValue | ThemeValue<C, 'direction'>
	/**
	 * Specifies outer layout used of the element and the inner layout used for its children.
	 *
	 * **Initial value**: `inline`
	 */
	display: CSSGlobalValue | CSSDisplayValue | ThemeValue<C, 'display'>
	dominantBaseline: CSSGlobalValue | ThemeValue<C, 'dominantBaseline'>
	emptyCells: CSSGlobalValue | ThemeValue<C, 'emptyCells'>
	fill: CSSGlobalValue | ThemeValue<C, 'fill'>
	fillBreak: CSSGlobalValue | ThemeValue<C, 'fillBreak'>
	fillColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'fillColor'>
	fillImage: CSSGlobalValue | ThemeValue<C, 'fillImage'>
	fillOpacity: CSSGlobalValue | ThemeValue<C, 'fillOpacity'>
	fillOrigin: CSSGlobalValue | ThemeValue<C, 'fillOrigin'>
	fillPosition: CSSGlobalValue | ThemeValue<C, 'fillPosition'>
	fillRepeat: CSSGlobalValue | ThemeValue<C, 'fillRepeat'>
	fillRule: CSSGlobalValue | ThemeValue<C, 'fillRule'>
	fillSize: CSSGlobalValue | ThemeValue<C, 'fillSize'>
	filter: CSSGlobalValue | ThemeValue<C, 'filter'>
	flex: CSSGlobalValue | ThemeValue<C, 'flex'>
	flexBasis: CSSGlobalValue | ThemeValue<C, 'flexBasis'>
	flexDirection: CSSGlobalValue | ThemeValue<C, 'flexDirection'>
	flexFlow: CSSGlobalValue | ThemeValue<C, 'flexFlow'>
	flexGrow: CSSGlobalValue | ThemeValue<C, 'flexGrow'>
	flexShrink: CSSGlobalValue | ThemeValue<C, 'flexShrink'>
	flexWrap: CSSGlobalValue | ThemeValue<C, 'flexWrap'>
	float: CSSGlobalValue | ThemeValue<C, 'float'>
	floatDefer: CSSGlobalValue | ThemeValue<C, 'floatDefer'>
	floatOffset: CSSGlobalValue | ThemeValue<C, 'floatOffset'>
	floatReference: CSSGlobalValue | ThemeValue<C, 'floatReference'>
	floodColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'floodColor'>
	floodOpacity: CSSGlobalValue | ThemeValue<C, 'floodOpacity'>
	flow: CSSGlobalValue | ThemeValue<C, 'flow'>
	flowFrom: CSSGlobalValue | ThemeValue<C, 'flowFrom'>
	flowInto: CSSGlobalValue | ThemeValue<C, 'flowInto'>
	font: CSSGlobalValue | ThemeValue<C, 'font'>
	fontFamily: CSSGlobalValue | ThemeValue<C, 'fontFamily'>
	fontFeatureSettings: CSSGlobalValue | ThemeValue<C, 'fontFeatureSettings'>
	fontKerning: CSSGlobalValue | ThemeValue<C, 'fontKerning'>
	fontLanguageOverride: CSSGlobalValue | ThemeValue<C, 'fontLanguageOverride'>
	fontOpticalSizing: CSSGlobalValue | ThemeValue<C, 'fontOpticalSizing'>
	fontPalette: CSSGlobalValue | ThemeValue<C, 'fontPalette'>
	fontSize: CSSGlobalValue | ThemeValue<C, 'fontSize'>
	fontSizeAdjust: CSSGlobalValue | ThemeValue<C, 'fontSizeAdjust'>
	fontStretch: CSSGlobalValue | ThemeValue<C, 'fontStretch'>
	fontStyle: CSSGlobalValue | ThemeValue<C, 'fontStyle'>
	fontSynthesis: CSSGlobalValue | ThemeValue<C, 'fontSynthesis'>
	fontSynthesisSmallCaps: CSSGlobalValue | ThemeValue<C, 'fontSynthesisSmallCaps'>
	fontSynthesisStyle: CSSGlobalValue | ThemeValue<C, 'fontSynthesisStyle'>
	fontSynthesisWeight: CSSGlobalValue | ThemeValue<C, 'fontSynthesisWeight'>
	fontVariant: CSSGlobalValue | ThemeValue<C, 'fontVariant'>
	fontVariantAlternates: CSSGlobalValue | ThemeValue<C, 'fontVariantAlternates'>
	fontVariantCaps: CSSGlobalValue | ThemeValue<C, 'fontVariantCaps'>
	fontVariantEastAsian: CSSGlobalValue | ThemeValue<C, 'fontVariantEastAsian'>
	fontVariantEmoji: CSSGlobalValue | ThemeValue<C, 'fontVariantEmoji'>
	fontVariantLigatures: CSSGlobalValue | ThemeValue<C, 'fontVariantLigatures'>
	fontVariantNumeric: CSSGlobalValue | ThemeValue<C, 'fontVariantNumeric'>
	fontVariantPosition: CSSGlobalValue | ThemeValue<C, 'fontVariantPosition'>
	fontVariationSettings: CSSGlobalValue | ThemeValue<C, 'fontVariationSettings'>
	fontWeight: CSSGlobalValue | ThemeValue<C, 'fontWeight'>
	footnoteDisplay: CSSGlobalValue | ThemeValue<C, 'footnoteDisplay'>
	footnotePolicy: CSSGlobalValue | ThemeValue<C, 'footnotePolicy'>
	forcedColorAdjust: CSSGlobalValue | ThemeValue<C, 'forcedColorAdjust'>
	gap: CSSGlobalValue | ThemeValue<C, 'gap'>
	glyphOrientationVertical: CSSGlobalValue | ThemeValue<C, 'glyphOrientationVertical'>
	grid: CSSGlobalValue | ThemeValue<C, 'grid'>
	gridArea: CSSGlobalValue | ThemeValue<C, 'gridArea'>
	gridAutoColumns: CSSGlobalValue | ThemeValue<C, 'gridAutoColumns'>
	gridAutoFlow: CSSGlobalValue | ThemeValue<C, 'gridAutoFlow'>
	gridAutoRows: CSSGlobalValue | ThemeValue<C, 'gridAutoRows'>
	gridColumn: CSSGlobalValue | ThemeValue<C, 'gridColumn'>
	gridColumnEnd: CSSGlobalValue | ThemeValue<C, 'gridColumnEnd'>
	gridColumnStart: CSSGlobalValue | ThemeValue<C, 'gridColumnStart'>
	gridRow: CSSGlobalValue | ThemeValue<C, 'gridRow'>
	gridRowEnd: CSSGlobalValue | ThemeValue<C, 'gridRowEnd'>
	gridRowStart: CSSGlobalValue | ThemeValue<C, 'gridRowStart'>
	gridTemplate: CSSGlobalValue | ThemeValue<C, 'gridTemplate'>
	gridTemplateAreas: CSSGlobalValue | ThemeValue<C, 'gridTemplateAreas'>
	gridTemplateColumns: CSSGlobalValue | ThemeValue<C, 'gridTemplateColumns'>
	gridTemplateRows: CSSGlobalValue | ThemeValue<C, 'gridTemplateRows'>
	hangingPunctuation: CSSGlobalValue | ThemeValue<C, 'hangingPunctuation'>
	/**
	 * Specifies the height of the element.
	 *
	 * **Initial value**: `auto`
	 */
	height: CSSGlobalValue | ThemeValue<C, 'height'>
	hyphenateCharacter: CSSGlobalValue | ThemeValue<C, 'hyphenateCharacter'>
	hyphenateLimitChars: CSSGlobalValue | ThemeValue<C, 'hyphenateLimitChars'>
	hyphenateLimitLast: CSSGlobalValue | ThemeValue<C, 'hyphenateLimitLast'>
	hyphenateLimitLines: CSSGlobalValue | ThemeValue<C, 'hyphenateLimitLines'>
	hyphenateLimitZone: CSSGlobalValue | ThemeValue<C, 'hyphenateLimitZone'>
	hyphens: CSSGlobalValue | ThemeValue<C, 'hyphens'>
	imageOrientation: CSSGlobalValue | ThemeValue<C, 'imageOrientation'>
	imageRendering: CSSGlobalValue | ThemeValue<C, 'imageRendering'>
	imageResolution: CSSGlobalValue | ThemeValue<C, 'imageResolution'>
	initialLetter: CSSGlobalValue | ThemeValue<C, 'initialLetter'>
	initialLetterAlign: CSSGlobalValue | ThemeValue<C, 'initialLetterAlign'>
	initialLetterWrap: CSSGlobalValue | ThemeValue<C, 'initialLetterWrap'>
	inlineSize: CSSGlobalValue | ThemeValue<C, 'inlineSize'>
	inlineSizing: CSSGlobalValue | ThemeValue<C, 'inlineSizing'>
	inset: CSSGlobalValue | ThemeValue<C, 'inset'>
	insetBlock: CSSGlobalValue | ThemeValue<C, 'insetBlock'>
	insetBlockEnd: CSSGlobalValue | ThemeValue<C, 'insetBlockEnd'>
	insetBlockStart: CSSGlobalValue | ThemeValue<C, 'insetBlockStart'>
	insetInline: CSSGlobalValue | ThemeValue<C, 'insetInline'>
	insetInlineEnd: CSSGlobalValue | ThemeValue<C, 'insetInlineEnd'>
	insetInlineStart: CSSGlobalValue | ThemeValue<C, 'insetInlineStart'>
	isolation: CSSGlobalValue | ThemeValue<C, 'isolation'>
	justifyContent: CSSGlobalValue | ThemeValue<C, 'justifyContent'>
	justifyItems: CSSGlobalValue | ThemeValue<C, 'justifyItems'>
	justifySelf: CSSGlobalValue | ThemeValue<C, 'justifySelf'>
	leadingTrim: CSSGlobalValue | ThemeValue<C, 'leadingTrim'>
	left: CSSGlobalValue | ThemeValue<C, 'left'>
	letterSpacing: CSSGlobalValue | ThemeValue<C, 'letterSpacing'>
	lightingColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'lightingColor'>
	lineBreak: CSSGlobalValue | ThemeValue<C, 'lineBreak'>
	lineClamp: CSSGlobalValue | ThemeValue<C, 'lineClamp'>
	lineGrid: CSSGlobalValue | ThemeValue<C, 'lineGrid'>
	lineHeight: CSSGlobalValue | ThemeValue<C, 'lineHeight'>
	lineHeightStep: CSSGlobalValue | ThemeValue<C, 'lineHeightStep'>
	linePadding: CSSGlobalValue | ThemeValue<C, 'linePadding'>
	lineSnap: CSSGlobalValue | ThemeValue<C, 'lineSnap'>
	listStyle: CSSGlobalValue | ThemeValue<C, 'listStyle'>
	listStyleImage: CSSGlobalValue | ThemeValue<C, 'listStyleImage'>
	listStylePosition: CSSGlobalValue | ThemeValue<C, 'listStylePosition'>
	listStyleType: CSSGlobalValue | ThemeValue<C, 'listStyleType'>
	margin: CSSGlobalValue | ThemeValue<C, 'margin'>
	marginBlock: CSSGlobalValue | ThemeValue<C, 'marginBlock'>
	marginBlockEnd: CSSGlobalValue | ThemeValue<C, 'marginBlockEnd'>
	marginBlockStart: CSSGlobalValue | ThemeValue<C, 'marginBlockStart'>
	marginBottom: CSSGlobalValue | ThemeValue<C, 'marginBottom'>
	marginBreak: CSSGlobalValue | ThemeValue<C, 'marginBreak'>
	marginInline: CSSGlobalValue | ThemeValue<C, 'marginInline'>
	marginInlineEnd: CSSGlobalValue | ThemeValue<C, 'marginInlineEnd'>
	marginInlineStart: CSSGlobalValue | ThemeValue<C, 'marginInlineStart'>
	marginLeft: CSSGlobalValue | ThemeValue<C, 'marginLeft'>
	marginRight: CSSGlobalValue | ThemeValue<C, 'marginRight'>
	marginTop: CSSGlobalValue | ThemeValue<C, 'marginTop'>
	marginTrim: CSSGlobalValue | ThemeValue<C, 'marginTrim'>
	marker: CSSGlobalValue | ThemeValue<C, 'marker'>
	markerEnd: CSSGlobalValue | ThemeValue<C, 'markerEnd'>
	markerKnockoutLeft: CSSGlobalValue | ThemeValue<C, 'markerKnockoutLeft'>
	markerKnockoutRight: CSSGlobalValue | ThemeValue<C, 'markerKnockoutRight'>
	markerMid: CSSGlobalValue | ThemeValue<C, 'markerMid'>
	markerPattern: CSSGlobalValue | ThemeValue<C, 'markerPattern'>
	markerSegment: CSSGlobalValue | ThemeValue<C, 'markerSegment'>
	markerSide: CSSGlobalValue | ThemeValue<C, 'markerSide'>
	markerStart: CSSGlobalValue | ThemeValue<C, 'markerStart'>
	mask: CSSGlobalValue | ThemeValue<C, 'mask'>
	maskBorder: CSSGlobalValue | ThemeValue<C, 'maskBorder'>
	maskBorderMode: CSSGlobalValue | ThemeValue<C, 'maskBorderMode'>
	maskBorderOutset: CSSGlobalValue | ThemeValue<C, 'maskBorderOutset'>
	maskBorderRepeat: CSSGlobalValue | ThemeValue<C, 'maskBorderRepeat'>
	maskBorderSlice: CSSGlobalValue | ThemeValue<C, 'maskBorderSlice'>
	maskBorderSource: CSSGlobalValue | ThemeValue<C, 'maskBorderSource'>
	maskBorderWidth: CSSGlobalValue | ThemeValue<C, 'maskBorderWidth'>
	maskClip: CSSGlobalValue | ThemeValue<C, 'maskClip'>
	maskComposite: CSSGlobalValue | ThemeValue<C, 'maskComposite'>
	maskImage: CSSGlobalValue | ThemeValue<C, 'maskImage'>
	maskMode: CSSGlobalValue | ThemeValue<C, 'maskMode'>
	maskOrigin: CSSGlobalValue | ThemeValue<C, 'maskOrigin'>
	maskPosition: CSSGlobalValue | ThemeValue<C, 'maskPosition'>
	maskRepeat: CSSGlobalValue | ThemeValue<C, 'maskRepeat'>
	maskSize: CSSGlobalValue | ThemeValue<C, 'maskSize'>
	maskType: CSSGlobalValue | ThemeValue<C, 'maskType'>
	maxBlockSize: CSSGlobalValue | ThemeValue<C, 'maxBlockSize'>
	maxHeight: CSSGlobalValue | ThemeValue<C, 'maxHeight'>
	maxInlineSize: CSSGlobalValue | ThemeValue<C, 'maxInlineSize'>
	maxLines: CSSGlobalValue | ThemeValue<C, 'maxLines'>
	maxWidth: CSSGlobalValue | ThemeValue<C, 'maxWidth'>
	minBlockSize: CSSGlobalValue | ThemeValue<C, 'minBlockSize'>
	minHeight: CSSGlobalValue | ThemeValue<C, 'minHeight'>
	minInlineSize: CSSGlobalValue | ThemeValue<C, 'minInlineSize'>
	minWidth: CSSGlobalValue | ThemeValue<C, 'minWidth'>
	mixBlendMode: CSSGlobalValue | ThemeValue<C, 'mixBlendMode'>
	navDown: CSSGlobalValue | ThemeValue<C, 'navDown'>
	navLeft: CSSGlobalValue | ThemeValue<C, 'navLeft'>
	navRight: CSSGlobalValue | ThemeValue<C, 'navRight'>
	navUp: CSSGlobalValue | ThemeValue<C, 'navUp'>
	objectFit: CSSGlobalValue | ThemeValue<C, 'objectFit'>
	objectPosition: CSSGlobalValue | ThemeValue<C, 'objectPosition'>
	offset: CSSGlobalValue | ThemeValue<C, 'offset'>
	offsetAnchor: CSSGlobalValue | ThemeValue<C, 'offsetAnchor'>
	offsetDistance: CSSGlobalValue | ThemeValue<C, 'offsetDistance'>
	offsetPath: CSSGlobalValue | ThemeValue<C, 'offsetPath'>
	offsetPosition: CSSGlobalValue | ThemeValue<C, 'offsetPosition'>
	offsetRotate: CSSGlobalValue | ThemeValue<C, 'offsetRotate'>
	opacity: CSSGlobalValue | ThemeValue<C, 'opacity'>
	order: CSSGlobalValue | ThemeValue<C, 'order'>
	/**
	 * Specifies the minimum number of lines in the block container that must be shown at the bottom of a page, region, or column.
	 *
	 * **Initial value**: `2`
	 */
	orphans: CSSGlobalValue | ThemeValue<C, 'orphans'>
	/**
	 * Specifies the outline properties of the element.
	 *
	 * **Initial value**: `invert none medium`
	 */
	outline: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'outline'>
	/**
	 * Specifies the color of the element's outline.
	 *
	 * **Initial value**: `invert`
	 */
	outlineColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'outlineColor'>
	outlineOffset: CSSGlobalValue | ThemeValue<C, 'outlineOffset'>
	outlineStyle: CSSGlobalValue | ThemeValue<C, 'outlineStyle'>
	outlineWidth: CSSGlobalValue | ThemeValue<C, 'outlineWidth'>
	overflow: CSSGlobalValue | ThemeValue<C, 'overflow'>
	overflowAnchor: CSSGlobalValue | ThemeValue<C, 'overflowAnchor'>
	overflowBlock: CSSGlobalValue | ThemeValue<C, 'overflowBlock'>
	overflowClipMargin: CSSGlobalValue | ThemeValue<C, 'overflowClipMargin'>
	overflowInline: CSSGlobalValue | ThemeValue<C, 'overflowInline'>
	overflowWrap: CSSGlobalValue | ThemeValue<C, 'overflowWrap'>
	overflowX: CSSGlobalValue | ThemeValue<C, 'overflowX'>
	overflowY: CSSGlobalValue | ThemeValue<C, 'overflowY'>
	overscrollBehavior: CSSGlobalValue | ThemeValue<C, 'overscrollBehavior'>
	overscrollBehaviorBlock: CSSGlobalValue | ThemeValue<C, 'overscrollBehaviorBlock'>
	overscrollBehaviorInline: CSSGlobalValue | ThemeValue<C, 'overscrollBehaviorInline'>
	overscrollBehaviorX: CSSGlobalValue | ThemeValue<C, 'overscrollBehaviorX'>
	overscrollBehaviorY: CSSGlobalValue | ThemeValue<C, 'overscrollBehaviorY'>
	padding: CSSGlobalValue | ThemeValue<C, 'padding'>
	paddingBlock: CSSGlobalValue | ThemeValue<C, 'paddingBlock'>
	paddingBlockEnd: CSSGlobalValue | ThemeValue<C, 'paddingBlockEnd'>
	paddingBlockStart: CSSGlobalValue | ThemeValue<C, 'paddingBlockStart'>
	paddingBottom: CSSGlobalValue | ThemeValue<C, 'paddingBottom'>
	paddingInline: CSSGlobalValue | ThemeValue<C, 'paddingInline'>
	paddingInlineEnd: CSSGlobalValue | ThemeValue<C, 'paddingInlineEnd'>
	paddingInlineStart: CSSGlobalValue | ThemeValue<C, 'paddingInlineStart'>
	paddingLeft: CSSGlobalValue | ThemeValue<C, 'paddingLeft'>
	paddingRight: CSSGlobalValue | ThemeValue<C, 'paddingRight'>
	paddingTop: CSSGlobalValue | ThemeValue<C, 'paddingTop'>
	page: CSSGlobalValue | ThemeValue<C, 'page'>
	pageBreakAfter: CSSGlobalValue | ThemeValue<C, 'pageBreakAfter'>
	pageBreakBefore: CSSGlobalValue | ThemeValue<C, 'pageBreakBefore'>
	pageBreakInside: CSSGlobalValue | ThemeValue<C, 'pageBreakInside'>
	pause: CSSGlobalValue | ThemeValue<C, 'pause'>
	pauseAfter: CSSGlobalValue | ThemeValue<C, 'pauseAfter'>
	pauseBefore: CSSGlobalValue | ThemeValue<C, 'pauseBefore'>
	perspective: CSSGlobalValue | ThemeValue<C, 'perspective'>
	perspectiveOrigin: CSSGlobalValue | ThemeValue<C, 'perspectiveOrigin'>
	placeContent: CSSGlobalValue | ThemeValue<C, 'placeContent'>
	placeItems: CSSGlobalValue | ThemeValue<C, 'placeItems'>
	placeSelf: CSSGlobalValue | ThemeValue<C, 'placeSelf'>
	position: CSSGlobalValue | ThemeValue<C, 'position'>
	propertyName: CSSGlobalValue | ThemeValue<C, 'propertyName'>
	quotes: CSSGlobalValue | ThemeValue<C, 'quotes'>
	regionFragment: CSSGlobalValue | ThemeValue<C, 'regionFragment'>
	resize: CSSGlobalValue | ThemeValue<C, 'resize'>
	rest: CSSGlobalValue | ThemeValue<C, 'rest'>
	restAfter: CSSGlobalValue | ThemeValue<C, 'restAfter'>
	restBefore: CSSGlobalValue | ThemeValue<C, 'restBefore'>
	right: CSSGlobalValue | ThemeValue<C, 'right'>
	rotate: CSSGlobalValue | ThemeValue<C, 'rotate'>
	rowGap: CSSGlobalValue | ThemeValue<C, 'rowGap'>
	rubyAlign: CSSGlobalValue | ThemeValue<C, 'rubyAlign'>
	rubyMerge: CSSGlobalValue | ThemeValue<C, 'rubyMerge'>
	rubyOverhang: CSSGlobalValue | ThemeValue<C, 'rubyOverhang'>
	rubyPosition: CSSGlobalValue | ThemeValue<C, 'rubyPosition'>
	running: CSSGlobalValue | ThemeValue<C, 'running'>
	scale: CSSGlobalValue | ThemeValue<C, 'scale'>
	scrollBehavior: CSSGlobalValue | ThemeValue<C, 'scrollBehavior'>
	scrollMargin: CSSGlobalValue | ThemeValue<C, 'scrollMargin'>
	scrollMarginBlock: CSSGlobalValue | ThemeValue<C, 'scrollMarginBlock'>
	scrollMarginBlockEnd: CSSGlobalValue | ThemeValue<C, 'scrollMarginBlockEnd'>
	scrollMarginBlockStart: CSSGlobalValue | ThemeValue<C, 'scrollMarginBlockStart'>
	scrollMarginBottom: CSSGlobalValue | ThemeValue<C, 'scrollMarginBottom'>
	scrollMarginInline: CSSGlobalValue | ThemeValue<C, 'scrollMarginInline'>
	scrollMarginInlineEnd: CSSGlobalValue | ThemeValue<C, 'scrollMarginInlineEnd'>
	scrollMarginInlineStart: CSSGlobalValue | ThemeValue<C, 'scrollMarginInlineStart'>
	scrollMarginLeft: CSSGlobalValue | ThemeValue<C, 'scrollMarginLeft'>
	scrollMarginRight: CSSGlobalValue | ThemeValue<C, 'scrollMarginRight'>
	scrollMarginTop: CSSGlobalValue | ThemeValue<C, 'scrollMarginTop'>
	scrollPadding: CSSGlobalValue | ThemeValue<C, 'scrollPadding'>
	scrollPaddingBlock: CSSGlobalValue | ThemeValue<C, 'scrollPaddingBlock'>
	scrollPaddingBlockEnd: CSSGlobalValue | ThemeValue<C, 'scrollPaddingBlockEnd'>
	scrollPaddingBlockStart: CSSGlobalValue | ThemeValue<C, 'scrollPaddingBlockStart'>
	scrollPaddingBottom: CSSGlobalValue | ThemeValue<C, 'scrollPaddingBottom'>
	scrollPaddingInline: CSSGlobalValue | ThemeValue<C, 'scrollPaddingInline'>
	scrollPaddingInlineEnd: CSSGlobalValue | ThemeValue<C, 'scrollPaddingInlineEnd'>
	scrollPaddingInlineStart: CSSGlobalValue | ThemeValue<C, 'scrollPaddingInlineStart'>
	scrollPaddingLeft: CSSGlobalValue | ThemeValue<C, 'scrollPaddingLeft'>
	scrollPaddingRight: CSSGlobalValue | ThemeValue<C, 'scrollPaddingRight'>
	scrollPaddingTop: CSSGlobalValue | ThemeValue<C, 'scrollPaddingTop'>
	scrollSnapAlign: CSSGlobalValue | ThemeValue<C, 'scrollSnapAlign'>
	scrollSnapStop: CSSGlobalValue | ThemeValue<C, 'scrollSnapStop'>
	scrollSnapType: CSSGlobalValue | ThemeValue<C, 'scrollSnapType'>
	scrollbarColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'scrollbarColor'>
	scrollbarGutter: CSSGlobalValue | ThemeValue<C, 'scrollbarGutter'>
	scrollbarWidth: CSSGlobalValue | ThemeValue<C, 'scrollbarWidth'>
	shapeImageThreshold: CSSGlobalValue | ThemeValue<C, 'shapeImageThreshold'>
	shapeInside: CSSGlobalValue | ThemeValue<C, 'shapeInside'>
	shapeMargin: CSSGlobalValue | ThemeValue<C, 'shapeMargin'>
	shapeOutside: CSSGlobalValue | ThemeValue<C, 'shapeOutside'>
	spatialNavigationAction: CSSGlobalValue | ThemeValue<C, 'spatialNavigationAction'>
	spatialNavigationContain: CSSGlobalValue | ThemeValue<C, 'spatialNavigationContain'>
	spatialNavigationFunction: CSSGlobalValue | ThemeValue<C, 'spatialNavigationFunction'>
	speak: CSSGlobalValue | ThemeValue<C, 'speak'>
	speakAs: CSSGlobalValue | ThemeValue<C, 'speakAs'>
	stringSet: CSSGlobalValue | ThemeValue<C, 'stringSet'>
	stroke: CSSGlobalValue | ThemeValue<C, 'stroke'>
	strokeAlign: CSSGlobalValue | ThemeValue<C, 'strokeAlign'>
	strokeAlignment: CSSGlobalValue | ThemeValue<C, 'strokeAlignment'>
	strokeBreak: CSSGlobalValue | ThemeValue<C, 'strokeBreak'>
	strokeColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'strokeColor'>
	strokeDashCorner: CSSGlobalValue | ThemeValue<C, 'strokeDashCorner'>
	strokeDashJustify: CSSGlobalValue | ThemeValue<C, 'strokeDashJustify'>
	strokeDashadjust: CSSGlobalValue | ThemeValue<C, 'strokeDashadjust'>
	strokeDasharray: CSSGlobalValue | ThemeValue<C, 'strokeDasharray'>
	strokeDashcorner: CSSGlobalValue | ThemeValue<C, 'strokeDashcorner'>
	strokeDashoffset: CSSGlobalValue | ThemeValue<C, 'strokeDashoffset'>
	strokeImage: CSSGlobalValue | ThemeValue<C, 'strokeImage'>
	strokeLinecap: CSSGlobalValue | ThemeValue<C, 'strokeLinecap'>
	strokeLinejoin: CSSGlobalValue | ThemeValue<C, 'strokeLinejoin'>
	strokeMiterlimit: CSSGlobalValue | ThemeValue<C, 'strokeMiterlimit'>
	strokeOpacity: CSSGlobalValue | ThemeValue<C, 'strokeOpacity'>
	strokeOrigin: CSSGlobalValue | ThemeValue<C, 'strokeOrigin'>
	strokePosition: CSSGlobalValue | ThemeValue<C, 'strokePosition'>
	strokeRepeat: CSSGlobalValue | ThemeValue<C, 'strokeRepeat'>
	strokeSize: CSSGlobalValue | ThemeValue<C, 'strokeSize'>
	strokeWidth: CSSGlobalValue | ThemeValue<C, 'strokeWidth'>
	tabSize: CSSGlobalValue | ThemeValue<C, 'tabSize'>
	tableLayout: CSSGlobalValue | ThemeValue<C, 'tableLayout'>
	textAlign: CSSGlobalValue | ThemeValue<C, 'textAlign'>
	textAlignAll: CSSGlobalValue | ThemeValue<C, 'textAlignAll'>
	textAlignLast: CSSGlobalValue | ThemeValue<C, 'textAlignLast'>
	textCombineUpright: CSSGlobalValue | ThemeValue<C, 'textCombineUpright'>
	textDecoration: CSSGlobalValue | ThemeValue<C, 'textDecoration'>
	textDecorationColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'textDecorationColor'>
	textDecorationLine: CSSGlobalValue | ThemeValue<C, 'textDecorationLine'>
	textDecorationSkip: CSSGlobalValue | ThemeValue<C, 'textDecorationSkip'>
	textDecorationSkipBox: CSSGlobalValue | ThemeValue<C, 'textDecorationSkipBox'>
	textDecorationSkipInk: CSSGlobalValue | ThemeValue<C, 'textDecorationSkipInk'>
	textDecorationSkipInset: CSSGlobalValue | ThemeValue<C, 'textDecorationSkipInset'>
	textDecorationSkipSelf: CSSGlobalValue | ThemeValue<C, 'textDecorationSkipSelf'>
	textDecorationSkipSpaces: CSSGlobalValue | ThemeValue<C, 'textDecorationSkipSpaces'>
	textDecorationStyle: CSSGlobalValue | ThemeValue<C, 'textDecorationStyle'>
	textDecorationThickness: CSSGlobalValue | ThemeValue<C, 'textDecorationThickness'>
	textEdge: CSSGlobalValue | ThemeValue<C, 'textEdge'>
	textEmphasis: CSSGlobalValue | ThemeValue<C, 'textEmphasis'>
	textEmphasisColor: CSSGlobalValue | CSSNamedColor | ThemeValue<C, 'textEmphasisColor'>
	textEmphasisPosition: CSSGlobalValue | ThemeValue<C, 'textEmphasisPosition'>
	textEmphasisSkip: CSSGlobalValue | ThemeValue<C, 'textEmphasisSkip'>
	textEmphasisStyle: CSSGlobalValue | ThemeValue<C, 'textEmphasisStyle'>
	textGroupAlign: CSSGlobalValue | ThemeValue<C, 'textGroupAlign'>
	textIndent: CSSGlobalValue | ThemeValue<C, 'textIndent'>
	textJustify: CSSGlobalValue | ThemeValue<C, 'textJustify'>
	textOrientation: CSSGlobalValue | ThemeValue<C, 'textOrientation'>
	textOverflow: CSSGlobalValue | ThemeValue<C, 'textOverflow'>
	textShadow: CSSGlobalValue | ThemeValue<C, 'textShadow'>
	textSpaceCollapse: CSSGlobalValue | ThemeValue<C, 'textSpaceCollapse'>
	textSpaceTrim: CSSGlobalValue | ThemeValue<C, 'textSpaceTrim'>
	textSpacing: CSSGlobalValue | ThemeValue<C, 'textSpacing'>
	textTransform: CSSGlobalValue | ThemeValue<C, 'textTransform'>
	textUnderlineOffset: CSSGlobalValue | ThemeValue<C, 'textUnderlineOffset'>
	textUnderlinePosition: CSSGlobalValue | ThemeValue<C, 'textUnderlinePosition'>
	textWrap: CSSGlobalValue | ThemeValue<C, 'textWrap'>
	top: CSSGlobalValue | ThemeValue<C, 'top'>
	transform: CSSGlobalValue | ThemeValue<C, 'transform'>
	transformBox: CSSGlobalValue | ThemeValue<C, 'transformBox'>
	transformOrigin: CSSGlobalValue | ThemeValue<C, 'transformOrigin'>
	transformStyle: CSSGlobalValue | ThemeValue<C, 'transformStyle'>
	transition: CSSGlobalValue | ThemeValue<C, 'transition'>
	transitionDelay: CSSGlobalValue | ThemeValue<C, 'transitionDelay'>
	transitionDuration: CSSGlobalValue | ThemeValue<C, 'transitionDuration'>
	transitionProperty: CSSGlobalValue | ThemeValue<C, 'transitionProperty'>
	transitionTimingFunction: CSSGlobalValue | ThemeValue<C, 'transitionTimingFunction'>
	translate: CSSGlobalValue | ThemeValue<C, 'translate'>
	unicodeBidi: CSSGlobalValue | ThemeValue<C, 'unicodeBidi'>
	userSelect: CSSGlobalValue | ThemeValue<C, 'userSelect'>
	verticalAlign: CSSGlobalValue | ThemeValue<C, 'verticalAlign'>
	visibility: CSSGlobalValue | ThemeValue<C, 'visibility'>
	voiceBalance: CSSGlobalValue | ThemeValue<C, 'voiceBalance'>
	voiceDuration: CSSGlobalValue | ThemeValue<C, 'voiceDuration'>
	voiceFamily: CSSGlobalValue | ThemeValue<C, 'voiceFamily'>
	voicePitch: CSSGlobalValue | ThemeValue<C, 'voicePitch'>
	voiceRange: CSSGlobalValue | ThemeValue<C, 'voiceRange'>
	voiceRate: CSSGlobalValue | ThemeValue<C, 'voiceRate'>
	voiceStress: CSSGlobalValue | ThemeValue<C, 'voiceStress'>
	voiceVolume: CSSGlobalValue | ThemeValue<C, 'voiceVolume'>
	whiteSpace: CSSGlobalValue | ThemeValue<C, 'whiteSpace'>
	/**
	 * Specifies the minimum number of lines in the block container that must be shown at the top of a page, region, or column.
	 *
	 * **Initial value**: `2`
	 */
	widows: CSSGlobalValue | ThemeValue<C, 'widows'>
	/**
	 * Specifies the width of the element.
	 *
	 * **Initial value**: `auto`
	 */
	width: CSSGlobalValue | CSSSizingValue | ThemeValue<C, 'width'>
	/**
	 * Specifies a hint to how the element is expected to change.
	 *
	 * **Initial value**: `auto`
	 */
	willChange: CSSGlobalValue | ThemeValue<C, 'willChange'>
	wordBoundaryDetection: CSSGlobalValue | ThemeValue<C, 'wordBoundaryDetection'>
	wordBoundaryExpansion: CSSGlobalValue | ThemeValue<C, 'wordBoundaryExpansion'>
	wordBreak: CSSGlobalValue | ThemeValue<C, 'wordBreak'>
	wordSpacing: CSSGlobalValue | ThemeValue<C, 'wordSpacing'>
	wordWrap: CSSGlobalValue | ThemeValue<C, 'wordWrap'>
	wrapAfter: CSSGlobalValue | ThemeValue<C, 'wrapAfter'>
	wrapBefore: CSSGlobalValue | ThemeValue<C, 'wrapBefore'>
	wrapFlow: CSSGlobalValue | ThemeValue<C, 'wrapFlow'>
	wrapInside: CSSGlobalValue | ThemeValue<C, 'wrapInside'>
	wrapThrough: CSSGlobalValue | ThemeValue<C, 'wrapThrough'>
	/**
	 * Specifies whether lines of text are laid out horizontally or vertically, as well as the direction in which blocks progress.
	 *
	 * **Initial value**: `horizontal-tb`
	 */
	writingMode: CSSGlobalValue | ThemeValue<C, 'writingMode'>
	/**
	 * Specifies the z-order of a positioned element and its descendants or flex items.
	 *
	 * **Initial value**: `auto`
	 */
	zIndex: CSSGlobalValue | ThemeValue<C, 'zIndex'>
}

export type ThemeValue<C extends Config = Config, K extends string> = (
	K extends keyof C['themeMap']
		? `$${keyof C['theme'][C['themeMap'][K]]}`
	: never
) // prettier-ignore
