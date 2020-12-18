import { css } from './config.stitches'

const one = css({
	backgroundColor: 'red',
	variants: {
		variant: {
			red: {
				backgroundColor: 'red',
				marginX: 2,
			},
			green: {
				backgroundColor: 'red',
			},
		},
	},
})

one.variants.variant.green
const firstRule = css(
	{
		padding: '-moz-initial',
		color: 'red',
	},
	one,
)

firstRule({ variant: { when$potato: 'red' } })
