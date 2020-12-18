import { styled } from '../../stitches.config'

export default styled('button', {
	backgroundColor: 'gainsboro',
	border: 0,
	borderRadius: '9999px',
	color: 'inherit',
	display: 'inline-flex',
	fontSize: '15px',
	fontWeight: 500,
	lineHeight: '1',
	padding: '10px 15px',
	transition: 'all 200ms ease',
	'&': {
		textDecoration: 'none',
	},
	'&:hover': {
		boxShadow: '0 10px 25px rgba(0, 0, 0, .3)',
		transform: 'translateY(-2px)',
	},
	when$md: {
		fontSize: '15px',
	},
	variants: {
		color: {
			violet: {
				backgroundColor: '$violetBack',
				color: '$violetText',
				'&:hover': {
					backgroundColor: '$violetBackHover',
				},
			},
			gray: {
				backgroundColor: '$grayBack',
				color: '$grayText',
				'&:hover': {
					backgroundColor: '$grayBackHover',
				},
			},
		},
		size: {
			sm: {
				fontSize: '12px',
			},
			md: {
				fontSize: '16px',
			},
			lg: {
				fontSize: '24px',
			},
		},
	},
})
