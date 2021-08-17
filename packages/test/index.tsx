import * as Stitches from '@stitches/react'
import * as React from 'react'

export const { config, styled } = Stitches.createStitches({
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

export type StitchesCss = Stitches.CSS<typeof config>

const Text = styled('span', {})

const DEFAULT_TAG = 'h1'

type HeadingProps = React.ComponentProps<typeof DEFAULT_TAG> & { css?: StitchesCss }

export const Heading = React.forwardRef<React.ElementRef<typeof DEFAULT_TAG>, HeadingProps>((props, forwardedRef) => {
	return (
		<>
			{/* types here will be fast */}
			<Text as={DEFAULT_TAG} onClick={(e) => {console.log(e.altKey)}} ref={forwardedRef} />
			<Text onClick={(e) => {console.log(e.altKey)}} ref={forwardedRef} />
			<Text onClick={(e) => {console.log(e.altKey)}} ref={forwardedRef} css={{ backgroundColor: '$red100' }} />
			<Text onClick={(e) => {console.log(e.altKey)}} ref={forwardedRef} css={{ ...props.css, backgroundColor: '$red100' }} />
			<Text as="a" href="" onClick={(e) => {console.log(e.altKey)}} css={{ ...props.css, backgroundColor: '$red100' }} />
			{/*
				types here will be correct but autocompletion is going to be painfully slow when you add a new prop.
				This is the only case where  the autocompletion is slow
			*/}
			<Text as={DEFAULT_TAG} {...props} onClick={(e) => {console.log(e.altKey)}} ref={forwardedRef} />
		</>
	)
})

const App = () => {
	// when consuming the component it should be very fast too
	return <Heading />
}
