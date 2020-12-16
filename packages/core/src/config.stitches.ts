import createCss from './index'

export const css = createCss({
	theme: {
		colors: {
			red100: 'red',
		},
		sizes: {
			s: 'wef',
		},
		space: {
			red: '213',
		},
	},
	conditions: {
		potato: 'hi',
	},
	properties: {
		/**
		 * This is a util with some really nice intellisense
		 */
		marginX: (val: number) => {
			return {}
		},
		marginY: (val: number) => {
			return {
				color: 'red100',
			}
		},
	},
})
