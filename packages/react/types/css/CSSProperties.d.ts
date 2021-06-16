import { CSSGlobalValue } from './CSSGlobalValue'
import { Config } from '../createCss'
import { CSSNamedColor } from './CSSNamedColor'

// [ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>

export type CSSDisplayValue = `${CSSDisplayOutside} ${CSSDisplayInside}` | `${CSSDisplayInside} ${CSSDisplayOutside}` | CSSDisplayInternal | CSSDisplayBox | CSSDisplayLegacy
export type CSSDisplayOutside = 'block' | 'inline' | 'run-in'
export type CSSDisplayInside = 'flow' | 'flow-root' | 'table' | 'flex' | 'grid' | 'ruby'
export type CSSDisplayInternal = 'table-row-group' | 'table-header-group' | 'table-footer-group' | 'table-row' | 'table-cell' | 'table-column-group' | 'table-column' | 'table-caption' | 'ruby-base' | 'ruby-text' | 'ruby-base-container' | 'ruby-text-container' // prettier-ignore
export type CSSDisplayBox = 'contents' | 'none'
export type CSSDisplayLegacy = 'inline-block' | 'inline-list-item' | 'inline-table' | 'inline-flex' | 'inline-grid'

export type CSSProperties<C extends Config = Config, T extends {} = {}> = {
	alignContent: CSSGlobalValue
	alignItems: CSSGlobalValue
	alignSelf: CSSGlobalValue
	alignmentBaseline: CSSGlobalValue
	all: CSSGlobalValue
	animation: CSSGlobalValue
	animationDelay: CSSGlobalValue
	animationDirection: CSSGlobalValue
	animationDuration: CSSGlobalValue
	animationFillMode: CSSGlobalValue
	animationIterationCount: CSSGlobalValue
	animationName: CSSGlobalValue
	animationPlayState: CSSGlobalValue
	animationTimingFunction: CSSGlobalValue
	appearance: CSSGlobalValue
	aspectRatio: CSSGlobalValue
	backfaceVisibility: CSSGlobalValue
	background: CSSNamedColor
	backgroundAttachment: CSSGlobalValue
	backgroundBlendMode: CSSGlobalValue
	backgroundClip: CSSGlobalValue
	/**
	 * The **`background-color`** CSS property sets the background color of an element.
	 *
	 * **Initial value**: `transparent`
	 */
	backgroundColor: CSSGlobalValue | CSSNamedColor
	backgroundImage: CSSGlobalValue
	backgroundOrigin: CSSGlobalValue
	backgroundPosition: CSSGlobalValue
	backgroundRepeat: CSSGlobalValue
	backgroundSize: CSSGlobalValue
	baselineShift: CSSGlobalValue
	baselineSource: CSSGlobalValue
	blockEllipsis: CSSGlobalValue
	blockSize: CSSGlobalValue
	blockStep: CSSGlobalValue
	blockStepAlign: CSSGlobalValue
	blockStepInsert: CSSGlobalValue
	blockStepRound: CSSGlobalValue
	blockStepSize: CSSGlobalValue
	bookmarkLabel: CSSGlobalValue
	bookmarkLevel: CSSGlobalValue
	bookmarkState: CSSGlobalValue
	border: CSSGlobalValue
	borderBlock: CSSGlobalValue
	borderBlockColor: CSSGlobalValue | CSSNamedColor
	borderBlockEnd: CSSGlobalValue
	borderBlockEndColor: CSSGlobalValue | CSSNamedColor
	borderBlockEndStyle: CSSGlobalValue
	borderBlockEndWidth: CSSGlobalValue
	borderBlockStart: CSSGlobalValue
	borderBlockStartColor: CSSGlobalValue | CSSNamedColor
	borderBlockStartStyle: CSSGlobalValue
	borderBlockStartWidth: CSSGlobalValue
	borderBlockStyle: CSSGlobalValue
	borderBlockWidth: CSSGlobalValue
	borderBottom: CSSGlobalValue
	borderBottomColor: CSSGlobalValue | CSSNamedColor
	borderBottomLeftRadius: CSSGlobalValue
	borderBottomRightRadius: CSSGlobalValue
	borderBottomStyle: CSSGlobalValue
	borderBottomWidth: CSSGlobalValue
	borderBoundary: CSSGlobalValue
	borderCollapse: CSSGlobalValue
	borderColor: CSSGlobalValue | CSSNamedColor
	borderEndEndRadius: CSSGlobalValue
	borderEndStartRadius: CSSGlobalValue
	borderImage: CSSGlobalValue
	borderImageOutset: CSSGlobalValue
	borderImageRepeat: CSSGlobalValue
	borderImageSlice: CSSGlobalValue
	borderImageSource: CSSGlobalValue
	borderImageWidth: CSSGlobalValue
	borderInline: CSSGlobalValue
	borderInlineColor: CSSGlobalValue | CSSNamedColor
	borderInlineEnd: CSSGlobalValue
	borderInlineEndColor: CSSGlobalValue | CSSNamedColor
	borderInlineEndStyle: CSSGlobalValue
	borderInlineEndWidth: CSSGlobalValue
	borderInlineStart: CSSGlobalValue
	borderInlineStartColor: CSSGlobalValue | CSSNamedColor
	borderInlineStartStyle: CSSGlobalValue
	borderInlineStartWidth: CSSGlobalValue
	borderInlineStyle: CSSGlobalValue
	borderInlineWidth: CSSGlobalValue
	borderLeft: CSSGlobalValue
	borderLeftColor: CSSGlobalValue | CSSNamedColor
	borderLeftStyle: CSSGlobalValue
	borderLeftWidth: CSSGlobalValue
	borderRadius: CSSGlobalValue
	borderRight: CSSGlobalValue
	borderRightColor: CSSGlobalValue | CSSNamedColor
	borderRightStyle: CSSGlobalValue
	borderRightWidth: CSSGlobalValue
	borderSpacing: CSSGlobalValue
	borderStartEndRadius: CSSGlobalValue
	borderStartStartRadius: CSSGlobalValue
	borderStyle: CSSGlobalValue
	borderTop: CSSGlobalValue
	borderTopColor: CSSGlobalValue | CSSNamedColor
	borderTopLeftRadius: CSSGlobalValue
	borderTopRightRadius: CSSGlobalValue
	borderTopStyle: CSSGlobalValue
	borderTopWidth: CSSGlobalValue
	borderWidth: CSSGlobalValue
	bottom: CSSGlobalValue
	boxDecorationBreak: CSSGlobalValue
	boxShadow: CSSGlobalValue
	boxSizing: CSSGlobalValue
	boxSnap: CSSGlobalValue
	breakAfter: CSSGlobalValue
	breakBefore: CSSGlobalValue
	breakInside: CSSGlobalValue
	captionSide: CSSGlobalValue
	caret: CSSGlobalValue
	caretColor: CSSGlobalValue | CSSNamedColor
	caretShape: CSSGlobalValue
	chains: CSSGlobalValue
	clear: CSSGlobalValue
	clip: CSSGlobalValue
	clipPath: CSSGlobalValue
	clipRule: CSSGlobalValue
	/**
	 * The **`color`** CSS property sets the foreground color value of an element's text and text decorations, and sets the `currentcolor` value.
	 *
	 * **Initial value**: Varies from one browser to another
	 */
	color: CSSGlobalValue | CSSNamedColor
	colorAdjust: CSSGlobalValue
	colorInterpolationFilters: CSSGlobalValue
	colorScheme: CSSGlobalValue
	columnCount: CSSGlobalValue
	columnFill: CSSGlobalValue
	columnGap: CSSGlobalValue
	columnRule: CSSGlobalValue
	columnRuleColor: CSSGlobalValue | CSSNamedColor
	columnRuleStyle: CSSGlobalValue
	columnRuleWidth: CSSGlobalValue
	columnSpan: CSSGlobalValue
	columnWidth: CSSGlobalValue
	columns: CSSGlobalValue
	contain: CSSGlobalValue
	containIntrinsicSize: CSSGlobalValue
	content: CSSGlobalValue
	contentVisibility: CSSGlobalValue
	continue: CSSGlobalValue
	counterIncrement: CSSGlobalValue
	counterReset: CSSGlobalValue
	counterSet: CSSGlobalValue
	cue: CSSGlobalValue
	cueAfter: CSSGlobalValue
	cueBefore: CSSGlobalValue
	cursor: CSSGlobalValue
	direction: CSSGlobalValue
	display: CSSGlobalValue | CSSDisplayValue
	dominantBaseline: CSSGlobalValue
	emptyCells: CSSGlobalValue
	fill: CSSGlobalValue
	fillBreak: CSSGlobalValue
	fillColor: CSSGlobalValue | CSSNamedColor
	fillImage: CSSGlobalValue
	fillOpacity: CSSGlobalValue
	fillOrigin: CSSGlobalValue
	fillPosition: CSSGlobalValue
	fillRepeat: CSSGlobalValue
	fillRule: CSSGlobalValue
	fillSize: CSSGlobalValue
	filter: CSSGlobalValue
	flex: CSSGlobalValue
	flexBasis: CSSGlobalValue
	flexDirection: CSSGlobalValue
	flexFlow: CSSGlobalValue
	flexGrow: CSSGlobalValue
	flexShrink: CSSGlobalValue
	flexWrap: CSSGlobalValue
	float: CSSGlobalValue
	floatDefer: CSSGlobalValue
	floatOffset: CSSGlobalValue
	floatReference: CSSGlobalValue
	floodColor: CSSGlobalValue | CSSNamedColor
	floodOpacity: CSSGlobalValue
	flow: CSSGlobalValue
	flowFrom: CSSGlobalValue
	flowInto: CSSGlobalValue
	font: CSSGlobalValue
	fontFamily: CSSGlobalValue
	fontFeatureSettings: CSSGlobalValue
	fontKerning: CSSGlobalValue
	fontLanguageOverride: CSSGlobalValue
	fontOpticalSizing: CSSGlobalValue
	fontPalette: CSSGlobalValue
	fontSize: CSSGlobalValue
	fontSizeAdjust: CSSGlobalValue
	fontStretch: CSSGlobalValue
	fontStyle: CSSGlobalValue
	fontSynthesis: CSSGlobalValue
	fontSynthesisSmallCaps: CSSGlobalValue
	fontSynthesisStyle: CSSGlobalValue
	fontSynthesisWeight: CSSGlobalValue
	fontVariant: CSSGlobalValue
	fontVariantAlternates: CSSGlobalValue
	fontVariantCaps: CSSGlobalValue
	fontVariantEastAsian: CSSGlobalValue
	fontVariantEmoji: CSSGlobalValue
	fontVariantLigatures: CSSGlobalValue
	fontVariantNumeric: CSSGlobalValue
	fontVariantPosition: CSSGlobalValue
	fontVariationSettings: CSSGlobalValue
	fontWeight: CSSGlobalValue
	footnoteDisplay: CSSGlobalValue
	footnotePolicy: CSSGlobalValue
	forcedColorAdjust: CSSGlobalValue
	gap: CSSGlobalValue
	glyphOrientationVertical: CSSGlobalValue
	grid: CSSGlobalValue
	gridArea: CSSGlobalValue
	gridAutoColumns: CSSGlobalValue
	gridAutoFlow: CSSGlobalValue
	gridAutoRows: CSSGlobalValue
	gridColumn: CSSGlobalValue
	gridColumnEnd: CSSGlobalValue
	gridColumnStart: CSSGlobalValue
	gridRow: CSSGlobalValue
	gridRowEnd: CSSGlobalValue
	gridRowStart: CSSGlobalValue
	gridTemplate: CSSGlobalValue
	gridTemplateAreas: CSSGlobalValue
	gridTemplateColumns: CSSGlobalValue
	gridTemplateRows: CSSGlobalValue
	hangingPunctuation: CSSGlobalValue
	/**
	 * The **`height`** CSS property specifies the height of an element.
	 *
	 * **Initial value**: `auto`
	 */
	height: CSSGlobalValue
	hyphenateCharacter: CSSGlobalValue
	hyphenateLimitChars: CSSGlobalValue
	hyphenateLimitLast: CSSGlobalValue
	hyphenateLimitLines: CSSGlobalValue
	hyphenateLimitZone: CSSGlobalValue
	hyphens: CSSGlobalValue
	imageOrientation: CSSGlobalValue
	imageRendering: CSSGlobalValue
	imageResolution: CSSGlobalValue
	initialLetter: CSSGlobalValue
	initialLetterAlign: CSSGlobalValue
	initialLetterWrap: CSSGlobalValue
	inlineSize: CSSGlobalValue
	inlineSizing: CSSGlobalValue
	inset: CSSGlobalValue
	insetBlock: CSSGlobalValue
	insetBlockEnd: CSSGlobalValue
	insetBlockStart: CSSGlobalValue
	insetInline: CSSGlobalValue
	insetInlineEnd: CSSGlobalValue
	insetInlineStart: CSSGlobalValue
	isolation: CSSGlobalValue
	justifyContent: CSSGlobalValue
	justifyItems: CSSGlobalValue
	justifySelf: CSSGlobalValue
	leadingTrim: CSSGlobalValue
	left: CSSGlobalValue
	letterSpacing: CSSGlobalValue
	lightingColor: CSSGlobalValue | CSSNamedColor
	lineBreak: CSSGlobalValue
	lineClamp: CSSGlobalValue
	lineGrid: CSSGlobalValue
	lineHeight: CSSGlobalValue
	lineHeightStep: CSSGlobalValue
	linePadding: CSSGlobalValue
	lineSnap: CSSGlobalValue
	listStyle: CSSGlobalValue
	listStyleImage: CSSGlobalValue
	listStylePosition: CSSGlobalValue
	listStyleType: CSSGlobalValue
	margin: CSSGlobalValue
	marginBlock: CSSGlobalValue
	marginBlockEnd: CSSGlobalValue
	marginBlockStart: CSSGlobalValue
	marginBottom: CSSGlobalValue
	marginBreak: CSSGlobalValue
	marginInline: CSSGlobalValue
	marginInlineEnd: CSSGlobalValue
	marginInlineStart: CSSGlobalValue
	marginLeft: CSSGlobalValue
	marginRight: CSSGlobalValue
	marginTop: CSSGlobalValue
	marginTrim: CSSGlobalValue
	marker: CSSGlobalValue
	markerEnd: CSSGlobalValue
	markerKnockoutLeft: CSSGlobalValue
	markerKnockoutRight: CSSGlobalValue
	markerMid: CSSGlobalValue
	markerPattern: CSSGlobalValue
	markerSegment: CSSGlobalValue
	markerSide: CSSGlobalValue
	markerStart: CSSGlobalValue
	mask: CSSGlobalValue
	maskBorder: CSSGlobalValue
	maskBorderMode: CSSGlobalValue
	maskBorderOutset: CSSGlobalValue
	maskBorderRepeat: CSSGlobalValue
	maskBorderSlice: CSSGlobalValue
	maskBorderSource: CSSGlobalValue
	maskBorderWidth: CSSGlobalValue
	maskClip: CSSGlobalValue
	maskComposite: CSSGlobalValue
	maskImage: CSSGlobalValue
	maskMode: CSSGlobalValue
	maskOrigin: CSSGlobalValue
	maskPosition: CSSGlobalValue
	maskRepeat: CSSGlobalValue
	maskSize: CSSGlobalValue
	maskType: CSSGlobalValue
	maxBlockSize: CSSGlobalValue
	maxHeight: CSSGlobalValue
	maxInlineSize: CSSGlobalValue
	maxLines: CSSGlobalValue
	maxWidth: CSSGlobalValue
	minBlockSize: CSSGlobalValue
	minHeight: CSSGlobalValue
	minInlineSize: CSSGlobalValue
	minWidth: CSSGlobalValue
	mixBlendMode: CSSGlobalValue
	navDown: CSSGlobalValue
	navLeft: CSSGlobalValue
	navRight: CSSGlobalValue
	navUp: CSSGlobalValue
	objectFit: CSSGlobalValue
	objectPosition: CSSGlobalValue
	offset: CSSGlobalValue
	offsetAnchor: CSSGlobalValue
	offsetDistance: CSSGlobalValue
	offsetPath: CSSGlobalValue
	offsetPosition: CSSGlobalValue
	offsetRotate: CSSGlobalValue
	opacity: CSSGlobalValue
	order: CSSGlobalValue
	orphans: CSSGlobalValue
	outline: CSSGlobalValue | CSSNamedColor
	outlineColor: CSSGlobalValue | CSSNamedColor
	outlineOffset: CSSGlobalValue
	outlineStyle: CSSGlobalValue
	outlineWidth: CSSGlobalValue
	overflow: CSSGlobalValue
	overflowAnchor: CSSGlobalValue
	overflowBlock: CSSGlobalValue
	overflowClipMargin: CSSGlobalValue
	overflowInline: CSSGlobalValue
	overflowWrap: CSSGlobalValue
	overflowX: CSSGlobalValue
	overflowY: CSSGlobalValue
	overscrollBehavior: CSSGlobalValue
	overscrollBehaviorBlock: CSSGlobalValue
	overscrollBehaviorInline: CSSGlobalValue
	overscrollBehaviorX: CSSGlobalValue
	overscrollBehaviorY: CSSGlobalValue
	padding: CSSGlobalValue
	paddingBlock: CSSGlobalValue
	paddingBlockEnd: CSSGlobalValue
	paddingBlockStart: CSSGlobalValue
	paddingBottom: CSSGlobalValue
	paddingInline: CSSGlobalValue
	paddingInlineEnd: CSSGlobalValue
	paddingInlineStart: CSSGlobalValue
	paddingLeft: CSSGlobalValue
	paddingRight: CSSGlobalValue
	paddingTop: CSSGlobalValue
	page: CSSGlobalValue
	pageBreakAfter: CSSGlobalValue
	pageBreakBefore: CSSGlobalValue
	pageBreakInside: CSSGlobalValue
	pause: CSSGlobalValue
	pauseAfter: CSSGlobalValue
	pauseBefore: CSSGlobalValue
	perspective: CSSGlobalValue
	perspectiveOrigin: CSSGlobalValue
	placeContent: CSSGlobalValue
	placeItems: CSSGlobalValue
	placeSelf: CSSGlobalValue
	position: CSSGlobalValue
	propertyName: CSSGlobalValue
	quotes: CSSGlobalValue
	regionFragment: CSSGlobalValue
	resize: CSSGlobalValue
	rest: CSSGlobalValue
	restAfter: CSSGlobalValue
	restBefore: CSSGlobalValue
	right: CSSGlobalValue
	rotate: CSSGlobalValue
	rowGap: CSSGlobalValue
	rubyAlign: CSSGlobalValue
	rubyMerge: CSSGlobalValue
	rubyOverhang: CSSGlobalValue
	rubyPosition: CSSGlobalValue
	running: CSSGlobalValue
	scale: CSSGlobalValue
	scrollBehavior: CSSGlobalValue
	scrollMargin: CSSGlobalValue
	scrollMarginBlock: CSSGlobalValue
	scrollMarginBlockEnd: CSSGlobalValue
	scrollMarginBlockStart: CSSGlobalValue
	scrollMarginBottom: CSSGlobalValue
	scrollMarginInline: CSSGlobalValue
	scrollMarginInlineEnd: CSSGlobalValue
	scrollMarginInlineStart: CSSGlobalValue
	scrollMarginLeft: CSSGlobalValue
	scrollMarginRight: CSSGlobalValue
	scrollMarginTop: CSSGlobalValue
	scrollPadding: CSSGlobalValue
	scrollPaddingBlock: CSSGlobalValue
	scrollPaddingBlockEnd: CSSGlobalValue
	scrollPaddingBlockStart: CSSGlobalValue
	scrollPaddingBottom: CSSGlobalValue
	scrollPaddingInline: CSSGlobalValue
	scrollPaddingInlineEnd: CSSGlobalValue
	scrollPaddingInlineStart: CSSGlobalValue
	scrollPaddingLeft: CSSGlobalValue
	scrollPaddingRight: CSSGlobalValue
	scrollPaddingTop: CSSGlobalValue
	scrollSnapAlign: CSSGlobalValue
	scrollSnapStop: CSSGlobalValue
	scrollSnapType: CSSGlobalValue
	scrollbarColor: CSSGlobalValue | CSSNamedColor
	scrollbarGutter: CSSGlobalValue
	scrollbarWidth: CSSGlobalValue
	shapeImageThreshold: CSSGlobalValue
	shapeInside: CSSGlobalValue
	shapeMargin: CSSGlobalValue
	shapeOutside: CSSGlobalValue
	spatialNavigationAction: CSSGlobalValue
	spatialNavigationContain: CSSGlobalValue
	spatialNavigationFunction: CSSGlobalValue
	speak: CSSGlobalValue
	speakAs: CSSGlobalValue
	stringSet: CSSGlobalValue
	stroke: CSSGlobalValue
	strokeAlign: CSSGlobalValue
	strokeAlignment: CSSGlobalValue
	strokeBreak: CSSGlobalValue
	strokeColor: CSSGlobalValue | CSSNamedColor
	strokeDashCorner: CSSGlobalValue
	strokeDashJustify: CSSGlobalValue
	strokeDashadjust: CSSGlobalValue
	strokeDasharray: CSSGlobalValue
	strokeDashcorner: CSSGlobalValue
	strokeDashoffset: CSSGlobalValue
	strokeImage: CSSGlobalValue
	strokeLinecap: CSSGlobalValue
	strokeLinejoin: CSSGlobalValue
	strokeMiterlimit: CSSGlobalValue
	strokeOpacity: CSSGlobalValue
	strokeOrigin: CSSGlobalValue
	strokePosition: CSSGlobalValue
	strokeRepeat: CSSGlobalValue
	strokeSize: CSSGlobalValue
	strokeWidth: CSSGlobalValue
	tabSize: CSSGlobalValue
	tableLayout: CSSGlobalValue
	textAlign: CSSGlobalValue
	textAlignAll: CSSGlobalValue
	textAlignLast: CSSGlobalValue
	textCombineUpright: CSSGlobalValue
	textDecoration: CSSGlobalValue
	textDecorationColor: CSSGlobalValue | CSSNamedColor
	textDecorationLine: CSSGlobalValue
	textDecorationSkip: CSSGlobalValue
	textDecorationSkipBox: CSSGlobalValue
	textDecorationSkipInk: CSSGlobalValue
	textDecorationSkipInset: CSSGlobalValue
	textDecorationSkipSelf: CSSGlobalValue
	textDecorationSkipSpaces: CSSGlobalValue
	textDecorationStyle: CSSGlobalValue
	textDecorationThickness: CSSGlobalValue
	textEdge: CSSGlobalValue
	textEmphasis: CSSGlobalValue
	textEmphasisColor: CSSGlobalValue | CSSNamedColor
	textEmphasisPosition: CSSGlobalValue
	textEmphasisSkip: CSSGlobalValue
	textEmphasisStyle: CSSGlobalValue
	textGroupAlign: CSSGlobalValue
	textIndent: CSSGlobalValue
	textJustify: CSSGlobalValue
	textOrientation: CSSGlobalValue
	textOverflow: CSSGlobalValue
	textShadow: CSSGlobalValue
	textSpaceCollapse: CSSGlobalValue
	textSpaceTrim: CSSGlobalValue
	textSpacing: CSSGlobalValue
	textTransform: CSSGlobalValue
	textUnderlineOffset: CSSGlobalValue
	textUnderlinePosition: CSSGlobalValue
	textWrap: CSSGlobalValue
	top: CSSGlobalValue
	transform: CSSGlobalValue
	transformBox: CSSGlobalValue
	transformOrigin: CSSGlobalValue
	transformStyle: CSSGlobalValue
	transition: CSSGlobalValue
	transitionDelay: CSSGlobalValue
	transitionDuration: CSSGlobalValue
	transitionProperty: CSSGlobalValue
	transitionTimingFunction: CSSGlobalValue
	translate: CSSGlobalValue
	unicodeBidi: CSSGlobalValue
	userSelect: CSSGlobalValue
	verticalAlign: CSSGlobalValue
	visibility: CSSGlobalValue
	voiceBalance: CSSGlobalValue
	voiceDuration: CSSGlobalValue
	voiceFamily: CSSGlobalValue
	voicePitch: CSSGlobalValue
	voiceRange: CSSGlobalValue
	voiceRate: CSSGlobalValue
	voiceStress: CSSGlobalValue
	voiceVolume: CSSGlobalValue
	whiteSpace: CSSGlobalValue
	widows: CSSGlobalValue
	/**
	 * The **`width`** CSS property sets an element's width.
	 *
	 * **Initial value**: `auto`
	 */
	width: CSSGlobalValue
	willChange: CSSGlobalValue
	wordBoundaryDetection: CSSGlobalValue
	wordBoundaryExpansion: CSSGlobalValue
	wordBreak: CSSGlobalValue
	wordSpacing: CSSGlobalValue
	wordWrap: CSSGlobalValue
	wrapAfter: CSSGlobalValue
	wrapBefore: CSSGlobalValue
	wrapFlow: CSSGlobalValue
	wrapInside: CSSGlobalValue
	wrapThrough: CSSGlobalValue
	writingMode: CSSGlobalValue
	zIndex: CSSGlobalValue
}
