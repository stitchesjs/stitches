import { css } from './config.stitches'

const one = css({
	backgroundOrigin: 'border-box',
	mx: 213,
	when$potato: {
		mx: 213,
	},
	variants: {
		variant: {
			red: {},
			green: {},
		},
	},
})

one({ variant: 'red' })
one({ variant: 'green' })
one({ variant: 'black' })

const two = css(one, {
	variants: {
		variant: {
			black: {
				backgroundOrigin: 'border-box',
			},
		},
	},
})

two({ variant: 'red' })
two({ variant: 'green' })
two({ variant: 'black' })

const three = css(
	{
		variants: {
			variant: {
				wow22: {
					backgroundOrigin: 'border-box',
					mx: 23,
					when$potato: {
						mx: 2,
					},
				},
			},
		},
	},
	one,
	two,
	{
		variants: {
			variant: {
				wow: {
					backgroundOrigin: 'border-box',
				},
			},
		},
	},
)

three({ variant: 'wowergerg22' })
