import createCss from '../types'

const { css, toString } = createCss({
	media: {
		bp1: '(min-width: 640px)',
	},
})

css({
	color: 'red',
	'@bp1': {
		color: 'red',
	},
})

console.log(toString())
