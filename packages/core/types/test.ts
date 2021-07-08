import { createCss, Stitches } from './index'

const { config, css, global, theme } = createCss({
	prefix: 'sx',
	media: {
		bp1: '(min-width: 640px)',
		bp2: '(min-width: 960px)',
	},
	theme: {
		colors: {
			brand: '#0033ff',
		},
		space: {
			1: 5,
			2: '10px',
			3: '15px',
			4: '30px',
			5: '60px',
		},
	},
	utils: {
		/**
		 * The `c` property sets the color of an element.
		 */
		c: (value: Stitches.PropertyValue<'color'>) => ({
			color: value,
		}),
		/**
		 * The `mx` property sets the margin area on the horizontal axis of an element.
		 */
		mx: (value: Stitches.TokenValue<'space'>) => ({
			marginLeft: value,
			marginRight: value,
		}),
	},
})

void config
void config.media
void config.media.all
void config.media.bp1
void config.theme
void config.theme.colors
void config.theme.colors.brand
void config.themeMap
void config.themeMap.color

const component = css({
	'c': '',
	'color': '$brand',
	'display': 'contents',
	'marginLeft': 'auto',
	'mx': '',
	'@bp2': {
		'color': '$brand',
		'display': 'flex',
		'@bp1': {
			color: '$brand',
		},
	},
	'&:nth-child(1)': {
		color: '$brand',
		display: 'initial',
		mx: '$3',
	},
	'variants': {
		love: {
			awesome: {
				color: 'AntiqueWhite',
			},
			blossom: {
				color: 'BlueViolet',
			},
		},
		peace: {
			3: {
				color: '$brand',
				display: 'block',
			},
			/** All you need. */
			love: {
				color: '$brand',
				display: 'initial',
			},
			true: {
				color: '$brand',
				display: 'block',
			},
		},
	},
	'defaultVariants': {
		peace: 3
	},
	'compoundVariants': [
		{
			peace: true,
			love: 'awesome',
			anything: 'everything',
			css: {
				c: '$brand',
				mx: '$3',
			},
		},
	],
})

void component.className
void component.selector

const expression = component({
	peace: 3,
	love: 'awesome',
	unrelated: 'neato',
	alsounrelated: '',
	css: {
		c: '$brand',
		display: 'block',
		mx: '$3'
	},
})

void expression
void expression.className
void expression.selector
void expression.props
void expression.props.peace
void expression.props.love
void expression.props.unrelated
void expression.props.alsounrelated

void theme.colors
void theme.colors.brand
void theme.colors.brand.value
void theme.colors.brand.variable
void theme.colors.brand.computedValue

const themeExpression = theme({
	colors: {
		brand: '#224400',
	},
})

void themeExpression
void themeExpression.className
void themeExpression.selector
void themeExpression.colors
void themeExpression.colors.brand
void themeExpression.colors.brand.value
void themeExpression.colors.brand.variable
void themeExpression.colors.brand.computedValue

const globalComponent = global({
	body: {
		color: '$brand',
		display: 'block',
	},
})

void globalComponent

const globalExpression = globalComponent()

void globalExpression
