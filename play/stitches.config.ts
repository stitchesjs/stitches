import createCss from '@stitches/react'

const sheet = createCss({
	theme: {
		colors: {
			red: 'tomato',
		},
	},
})

export default sheet
export const { global, styled } = sheet
