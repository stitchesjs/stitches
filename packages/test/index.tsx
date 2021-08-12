import * as Stitches from '@stitches/react'
import * as React from 'react'


const { css, config, styled } = Stitches.createStitches({
	utils: {
		/** util to do stuff */
		ms: (marginX: number) => ({ marginLeft: marginX }),
	},
	theme: {
		colors: {
			red100: '#ff0000',
		},
	},
	themeMap: { ...Stitches.defaultThemeMap },
})

const StyledStatus = Stitches.styled('span', {
	color: 'red',
	variants: {
		mySize: {
			myLarge: {},
		},
	},
})

export const Status: React.ForwardRefExoticComponent<React.ComponentProps<typeof StyledStatus>> = React.forwardRef(
	(props, forwardedRef) => {
		return <StyledStatus aria-hidden {...props} ref={forwardedRef} />
	}
)

export default function Home() {
	return <Status onClick={event => { }} />
}