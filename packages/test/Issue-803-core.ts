import { globalCss } from '@stitches/core'

void globalCss({
	'@font-face': {
		fontFamily: 'Roboto',
		fontStyle: 'normal',
		fontWeight: '100',
		src: "url('/Roboto-Thin.ttf') format('truetype')",
	},
	'body': {
		color: 'ActiveText',
	},
})

void globalCss({
	'@font-face': [
		{
			fontFamily: 'Roboto',
			fontStyle: 'normal',
			fontWeight: '100',
			src: "url('/Roboto-Thin.ttf') format('truetype')",
		},
	],
	'body': {
		color: 'ActiveText',
	},
})

void globalCss(
	{
		'@font-face': {
			fontFamily: 'Roboto',
			fontStyle: 'normal',
			fontWeight: '100',
			src: "url('/Roboto-Thin.ttf') format('truetype')",
		},
		'body': {
			color: 'ActiveText',
		},
	},
	{
		'@font-face': [
			{
				fontFamily: 'Roboto',
				fontStyle: 'normal',
				fontWeight: '100',
				src: "url('/Roboto-Thin.ttf') format('truetype')",
			},
			{
				fontFamily: 'Roboto',
				fontStyle: 'normal',
				fontWeight: '400',
				src: "url('/Roboto-Regular.ttf') format('truetype')",
			},
		],
		'body': {
			color: 'ActiveText',
		},
	},
)

void globalCss({
	'@import': 'some.css',
	'body': {
		color: 'ActiveText',
	},
})

void globalCss(
	{
		'@import': 'some.css',
		'body': {
			color: 'ActiveText',
		},
	},
	{
		'@import': ['some.css', 'someother.css'],
		'body': {
			color: 'ActiveText',
		},
	},
)
