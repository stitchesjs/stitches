import * as React from 'react'
import { styled, CSS } from './stitches.config'

export const Text = styled('span', {
	background: '$red100',
	paddingBlock: '$2',
	color: 'AliceBlue',
	variants: {
		variant: {
			red: {
				backgroundColor: '$red100',
			}
		}
	},
})

const DEFAULT_TAG = 'h1'
const bla: CSS = {
	background: '$amber1',
}
 const Test = styled('div', bla)
export type HeadingProps = React.ComponentProps<typeof DEFAULT_TAG> & { css?: CSS }

// ref should be span element
type ref = React.ElementRef<typeof Text>

const Heading = React.forwardRef<React.ElementRef<typeof DEFAULT_TAG>, HeadingProps>((props, forwardedRef) => {
	return (
		<>
			<Text onClick={(e) => { console.log(e.altKey) }} css={{backgroundClip: 'content-box', "@bp10": { backgroundClip: 'content-box' }}} />
			<Text as={DEFAULT_TAG} onClick={(e: any) => { console.log(e.altKey) }} ref={forwardedRef} css={{ borderTopColor: 'AliceBlue', backgroundColor: 'ActiveText', backgroundAttachment: 'inherit', backgroundOrigin: 'border-box', colorAdjust: 'economy' }} />
			<Text onClick={(e) => { console.log(e.altKey) }} ref={forwardedRef} css={{ 'backgroundClip': 'border-box', 'ml': 'auto', '@bp1': { backgroundAttachment: 'fixed', }, hello: { backgroundClip: 'border-box' } }} />
			<Text onClick={(e) => { console.log(e.altKey) }} ref={forwardedRef} css={{ backgroundColor: '$red100', backgroundAttachment: 'inherit', backgroundOrigin: 'border-box' }} />
			<Text as="b" onClick={(e: any) => { console.log(e.altKey) }} ref={forwardedRef} css={{ ...props.css, 'backgroundColor': '$red100', 'padding': 'initial', '@bp3': { paddingBlock: 'inherit', }, }} />
			<Text as="div" onClick={(e: any) => { console.log(e.altKey) }} css={{ ...props.css, backgroundColor: '$red100', background: 'red', paddingLeft: 'initial'}} />
			<Text as="div" onClick={(e: any) => { console.log(e.altKey) }} css={props.css} />
			<Text as={DEFAULT_TAG} {...props} onClick={(e: any) => { console.log(e.altKey) }} ref={forwardedRef} />
		</>
	)
})

const App = () => {
	// when consuming the component it should be very fast too
	return <Heading css={{ backgroundColor: '$red100', padding: 'inherit', colorScheme: 'dark' }} />
}
