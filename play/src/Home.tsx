import React from 'react'
import { global, styled } from '../stitches.config'
import Button from './components/Button'

const reset = global({
	'@import': 'url("https://unpkg.com/sanitize.css")',
	body: {
		fontFamily: '$main',
		textAlign: 'center',
	},
})

const Heading = styled('h1', {
	padding: '0 25px',
})

const SubHeading = styled('h2', {
	color: '#40494f',
	padding: '0 25px',
})

export default function Home() {
	reset()

	return (
		<>
			<Heading>The modern styling library</Heading>
			<SubHeading>
				Near-zero runtime, server-side rendering, multi-variant support, and a best-in-class developer experience.
			</SubHeading>
			<p>
				<Button>Example Button</Button>
			</p>
		</>
	)
}
