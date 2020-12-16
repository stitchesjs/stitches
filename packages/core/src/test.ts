import { css } from './config.stitches'

const firstRule = css(
	{
		backgroundColor: 'red',
		variants: {
			variant: {
				red: {
					backgroundColor: 'red',
				},
			},
		},
	},
	{
		backgroundColor: 'red',
		variants: {
			variant: {
				red: {
					backgroundColor: 'red',
				},
			},
		},
	},
	{
		backgroundOrigin: 'border-box',
		variants: {
			variant: {
				reds: {
					backgroundColor: 'blue',
				},
			},
		},
		backgroundColor: 'red1',
	},
)

const rule = css(
	{
		variants: {
			variant: {
				red: {
					color: 'red',
					backgroundClip: 'inherit',
				},
			},
		},
	},
	{
		variants: {
			variant: {
				red: {
					backgroundColor: 'red100',
					color: 'red',
					backgroundClip: 'inherit',
				},
			},
		},
	},
)
