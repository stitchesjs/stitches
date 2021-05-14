import { createCss } from '../types'

const { css, toString } = createCss({
	media: {
		bp1: '(min-width: 640px)',
	},
})

const xyz = css({
	color: 'red',
})

void xyz()
void toString()
