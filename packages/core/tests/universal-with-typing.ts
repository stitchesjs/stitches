import createCss from '../types'

const { css, toString } = createCss({
	theme: {
		colors: {
			red: 'tomato',
		},
	},
})

css({
	color: '$red',
	'@bp1': {
		color: '$red',
	},
	variants: {
		color: {
			red: {
				color: '$red',
			},
		},
	},
})

console.log(toString())
