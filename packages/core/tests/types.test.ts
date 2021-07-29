import { createStitches } from '../types/index'

const { css, globalCss, keyframes } = createStitches({
	utils: {
		mx: () => ({
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

keyframes({
	from: {
		color: '$gray100',
	},
	to: {
		color: '$gray900',
	},
})

globalCss({
	hello: {
		'@bp1': {
			backgroundColor: '$gray100',
		},
		backgroundColor: '$gray300',
	},
})

// const externalStyles: Arg<typeof css> = {
// 	'@bp1': {
// 		backgroundColor: '$gray100',
// 	},
// 	'backgroundColor': '$gray300',
// }

// void externalStyles

const PotatoButton = css({
	variants: {
		peace: {
			mercy: {
				color: 'MediumOrchid',
			},
			trust: {
				color: 'Turquoise',
			},
		},
		hue: {
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

PotatoButton({
	peace: 'mercy',
})

const two = css(PotatoButton, {
	$$max: '2px',
	width: '$$max',
	variants: {
		hue: {
			green: {
				width: '$$max',
				backgroundColor: '$gray100',
			},
			red: {
				backgroundColor: '$gray100',
			},
		},
		love: {
			free: {
				color: 'ForestGreen',
			},
			good: {
				color: 'GoldenRod',
			},
		}
	},
	defaultVariants: {
		hue: 'red',
	},
	compoundVariants: [
		{
			hue: 'green',
			css: {
				backgroundColor: '$gray200',
			},
		},
	],
})

two({
	peace: 'mercy',
	hue: 'green',
	love: 'free',
})

PotatoButton({
	className: '',
	css: {
		backgroundColor: '$gray300',

		'@all': {
			backgroundColor: 'initial'
		},

		'@bp1': {
			backgroundColor: 'initial',
		}
	},
})
