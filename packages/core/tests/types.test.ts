// core types.tests.ts
import { createCss, StitchesCss, StitchesVariants } from '../types/index.d'
const css = createCss({
	utils: {
		mx: (config) => (value) => ({
			backgroundColor: 'red',
		}),
	},
	theme: {
		colors: {
			hiContrast: 'hsl(200, 12%, 5%)',
			loContrast: 'white',
			gray100: 'hsl(206, 20%, 98.8%)',
			gray200: 'hsl(206, 14%, 96.0%)',
			gray300: 'hsl(206, 13%, 93.7%)',
			gray400: 'hsl(206, 12%, 92.0%)',
			gray500: 'hsl(206, 12%, 89.5%)',
			gray600: 'hsl(206, 11%, 85.2%)',
			gray700: 'hsl(206, 10%, 80.0%)',
			gray800: 'hsl(206, 6%, 56.1%)',
			gray900: 'hsl(206, 6%, 43.9%)',
			pedro: '$gray100',
		},
		space: {
			1: '10px',
			2: '20px',
		},
		fontSizes: {
			'1': '11px',
			'2': '13px',
			'3': '15px',
			'4': '17px',
			'5': '19px',
			'6': '21px',
			'7': '27px',
			'8': '35px',
			'9': '59px',
		},
	},
	media: {
		bp1: '(min-width: 620px)',
	},
})

css.keyframes({
	from: {
		color: '-moz-initial',
	},
	to: {
		backgroundColor: '-moz-initial',
	},
})

css.global({
	hello: {
		'@bp1': {
			backgroundColor: '$1',
		},
		'backgroundColor': '$font100',
	},
})

type CSS = StitchesCss<typeof css>

const ExternalStyles: CSS = {
	'@bp1': {
		backgroundColor: '$1',
	},
	'backgroundColor': '$1',
}

const PotatoButton = css.css({
	variants: {
		variant: {
			blue: {
				backgroundColor: '$gray100',
			},
			red: {
				backgroundColor: '$gray100',
			},
		},
	},
	compoundVariants: [
		{
			variant: 'blue',
			css: {
				backgroundColor: '$gray200',
			},
		},
	],
})

const two = css.css(PotatoButton, {
	$$max: '2px',
	width: '$$max',
	variants: {
		variant: {
			green: {
				width: '$$max',
				backgroundColor: '$gray100',
			},
			red: {
				backgroundColor: '$gray100',
			},
		},
	},
	defaultVariants: {
		variant: 'red',
	},
	compoundVariants: [
		{
			// cool

			variant: 'green',
			css: {
				backgroundColor: '$gray200',
			},
		},
	],
})

two({ variant: 'green' })
two({ variant: 'red' })
two({ variant: 'blue' })

type test = StitchesVariants<typeof PotatoButton>

const theme = css.theme({})

PotatoButton({
	className: '',
	css: {
		'backgroundColor': '$red100',

		'@initial': {
			backgroundColor: '-moz-initial',
		},
		'@bp1': {
			backgroundColor: '-moz-initial',
		},
	},
})
