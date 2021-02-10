import createStyled from '../types/index.d'
const cssz = createStyled({
	conditions: {
		lrg: '',
	},
	utils: {
		mx: (scales) => (value: keyof typeof scales['colors']) => {
			console.log(scales.colors.red100)
			return {}
		},
	},
	theme: {
		colors: {
			red100: 'red',
		},
	},
})

cssz.theme({
	colors: {
		red100: '',
	},
})
cssz.theme('hello', {
	colors: {
		red100: 'red',
	},
})

const b = cssz({
	backgroundColor: '$red100',
	mx: 'red100',
	variants: {
		size: {
			1: {},
			2: {},
		},
		variant: {
			red: {
				backgroundColor: 'AppWorkspace',
			},
		},
	},

	defaultVariants: {
		size: 1,
		variant: 'red',
	},
	compoundVariants: {
		size: 1,
		variant: 'red',
		css: { backgroundColor: '$red100' },
	},

	when: {
		lrg: {
			backgroundColor: '-moz-initial',
		},
	},
})

b({
	className: '',
	size: '2',
	css: {
		backgroundColor: '$red100',
		when: {
			fwefew: {},
			initial: {},
			lrg: {
				backgroundColor: '-moz-initial',
			},
		},
	},
})
