import React from 'react'
import { styled } from '../stitches.config'

const Button = styled('button', {
	backgroundColor: 'white',
	border: 0,
	color: 'blue',
})

export default function Home() {
	return (
		<>
			<h1>Stitches</h1>
			<p>
				<Button>Custom Button</Button>
			</p>
		</>
	)
}
