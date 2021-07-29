import { createStitches } from '../types'

const { css, toString } = createStitches({
	media: {
		bp1: '(min-width: 640px)',
	},
})

const xyz = css({
	color: 'red',
})

void xyz()
void toString()
