import * as Stitches from '@stitches/react'
import * as React from 'react'

const { config, styled } = Stitches.createStitches({
	utils: {
		/** util to do stuff */
		ml: (value: Stitches.PropertyValue<'margin'>) => ({ marginLeft: value }),
	},
	theme: {
		colors: {
			red100: '#ff0000',
		},
	},
})

// ---------------------------------------------------------------------------
// INSTRUCTIONS:
// Test cases are below.
// Make sure to only have one uncommented use case at once.
// Make sure to "Restart TS Server".
// Be patient, some errors only show up after 30+ seconds.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// USE CASE 1
// ---------------------------------------------------------------------------

const StyledStatus = styled('span', {
	color: '$', // we should see `$red100` here
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
	return <Status onClick={event => { }} css={{color: '$'}} mySize="myLarge" /> // we should see `$red100` here
}

// ---------------------------------------------------------------------------
// USE CASE 2
// Uncomment to test
// ---------------------------------------------------------------------------

// type CSS = Stitches.CSS<typeof config>

// const shared: CSS = {
// 	color: '$red100'
// }

// const Text = styled('span', shared)

// ---------------------------------------------------------------------------
// USE CASE 3
// ---------------------------------------------------------------------------

// type CSS = Stitches.CSS<typeof config>

// const StyledStatus = styled('span', {
// 	color: '$', // we should see `$red100` here
// 	variants: {
// 		mySize: {
// 			myLarge: {},
// 		},
// 	},
// })

// type StatusVariants = Stitches.VariantProps<typeof StyledStatus>;
// type StatusProps = { css?: CSS, children?: React.ReactNode } & StatusVariants;

// export const Status = React.forwardRef<HTMLSpanElement, StatusProps>(
// 	(props, forwardedRef) => {
// 		return <StyledStatus {...props} ref={forwardedRef} />
// 	}
// )

// export default function Home() {
// 	return <Status mySize="myLarge" css={{color: '$red100'}}  /> // we should see `$red100` here and `mySize` variant
// }
