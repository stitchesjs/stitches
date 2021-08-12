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

type CSS = Stitches.CSS<typeof config>

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

const Component1 = styled('button', {
	color: '$', // we should see `$red100` here
	variants: {
		mySize: {
			myLarge: {},
		},
	},
})

export const ForwardComponent1: React.ForwardRefExoticComponent<React.ComponentProps<typeof Component1>> = React.forwardRef(
	(props, forwardedRef) => {
		return <Component1 aria-hidden {...props} ref={forwardedRef} />
	}
)

export default function Home() {
	return <ForwardComponent1
		onClick={event => {
			void event // we should see `React.MouseEvent<HTMLButtonElement, MouseEvent>` here
		}}
		mySize="myLarge"
		css={{
			color: '$', // we should see `$red100` here
			'&:hover': {
				color: '$', // we should see `$red100` here
				'&:hover': {
					color: '$', // we should see `$red100` here
				},
			},
		}}
	/>
}

// ---------------------------------------------------------------------------
// USE CASE 2
// Uncomment to test
// ---------------------------------------------------------------------------

const sharedStylesForComponent2: CSS = {
	color: '$', // we should see `$red100` here
	'&:hover': {
		color: '$', // we should see `$red100` here
		'&:hover': {
			color: '$', // we should see `$red100` here
		},
	},
}

export const Component2 = styled('span', sharedStylesForComponent2)

// ---------------------------------------------------------------------------
// USE CASE 3
// ---------------------------------------------------------------------------

export const Component3 = styled('span', {
	color: '$', // we should see `$red100` here
	variants: {
		mySize: {
			myLarge: {},
		},
	},
})

export type Component3Variants = Stitches.VariantProps<typeof Component3>;
export type Component3Props = { css?: CSS, children?: React.ReactNode } & Component3Variants;

export const ForwardComponent3 = React.forwardRef<HTMLSpanElement, Component3Props>(
	(props, forwardedRef) => {
		return <Component3 {...props} ref={forwardedRef} />
	}
)

export function TestForwardComponent3() {
	return (
		<ForwardComponent3
			css={{
				color: '$red100' // we should see `$red100` here
			}}
			// we should see `mySize` variant as an option here
		/>
	)
}
