import createCss, { StitchesCss } from '../types/index.d'
const css = createCss({
	conditions: {
		lrg: '@potato',
	},
	themeMap: {
		backgroundColor: 'fonts',
	},
	theme: {
		colors: {
			red100: '',
		},
		fonts: {
			font100: '',
		},
	},
	utils: {
		mx: (scales) => (value: keyof typeof scales['colors']) => ({}),
	},
})

type CSS = StitchesCss<typeof css>

const ExternalStyles: CSS = {
	backgroundColor: '$font100'
}

const PotatoButton = css({
	variants: {
		color: {
			red: {
				backgroundClip: 'border-box',
			},
		},
	},
})

PotatoButton({
	className: '',
	color: 'red',
	css: {
		backgroundColor: '$red100',
		when: {
			initial: {
				backgroundColor: '-moz-initial',
			},
			lrg: {
				backgroundColor: '-moz-initial',
			},
		},
	},
})
