import * as React from 'react'
import { styled } from './stitches.config'

const Box = styled('div', {
	variants: {
		size: {
			small: {},
		},
	},
})

const Flex = styled(Box, {
	variants: {
		variant: {
			red: {},
		},
	},
})

export default function App() {
	return (
		<>
			<Flex as="a" variant="red" size="small" />
			<Flex as="a" variant="red" />
			<Flex as="a" size="small" />
			<Flex variant="red" size="small" />
			<Flex variant="red" />
			<Flex size="small" />
		</>
	)
}
