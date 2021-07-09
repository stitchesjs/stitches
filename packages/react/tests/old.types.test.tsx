import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { createCss } from '../types/index'

// import { createCss, StitchesVariants, StitchesComponentWithAutoCompleteForReactComponents, StitchesComponentWithAutoCompleteForJSXElements } from '../types/index'

import type * as Polymorphic from '@radix-ui/react-polymorphic'
import { Stitches } from '../types/styled'

const library1 = createCss({
	theme: {
		colors: {
			hiContrast: 'hsl(200, 12%, 5%)',
			loContrast: 'white',

			gray100: 'hsl(206, 20%, 98.8%)',
			gray200: 'hsl(206, 14%, 96.0%)',
			gray300: 'hsl(206, 13%, 93.7%)',
			gray400: 'hsl(206, 12%, 92.0%)',
			gray500: 'hsl(206, 12%, 89.5%)',
			gray600: 'hsl(206, 11%, 85.2%)',
			gray700: 'hsl(206, 10%, 80.0%)',
			gray800: 'hsl(206, 6%, 56.1%)',
			gray900: 'hsl(206, 6%, 43.9%)',

			pedro: '$gray100',
		},
		space: {
			1: '10px',
			2: '20px',
		},
		fontSizes: {
			1: '11px',
			2: '13px',
			3: '15px',
			4: '17px',
			5: '19px',
			6: '21px',
			7: '27px',
			8: '35px',
			9: '59px',
		},
	},
	media: {
		bp1: '(min-width: 620px)',
	},
	utils: {
		marginX: (value: Stitches.PropertyValue<'marginLeft'>) => ({
			marginLeft: value,
			marginRight: value,
		}),
	},
})

const utils = {
	mt: (value: Stitches.PropertyValue<'marginTop'>) => ({ marginTop: value }),
}

const library2 = createCss({
	utils,
})

const { config: Config } = library2

// type CSS = StitchesCss<typeof library>

const { config, css, keyframes, global, styled, theme, toString } = library1

void config
void config.media
void config.media.all
void config.media.bp1
void config.prefix
void config.theme
void config.theme.colors
void config.theme.colors.gray100
void config.themeMap
void config.themeMap.color
void config.utils
void config.utils.marginX

void css
void keyframes
void styled
void theme

const StyledSeparator = styled(SeparatorPrimitive.Root, {
	border: 'none',
	margin: 0,
	flexShrink: 0,
	backgroundColor: '$gray500',
	cursor: 'default',
	variants: {
		size: {
			'1': {
				'&[data-orientation="horizontal"]': {
					height: '1px',
					width: '$3',
				},
				'&[data-orientation="vertical"]': {
					width: '1px',
					height: '$3',
				},
			},
			'2': {
				'&[data-orientation="horizontal"]': {
					height: '1px',
					width: '$7',
				},
				'&[data-orientation="vertical"]': {
					width: '1px',
					height: '$7',
				},
			},
		},
	},
})

type SeparatorVariants = StitchesVariants<typeof StyledSeparator>
type SeparatorOwnProps = Polymorphic.OwnProps<typeof SeparatorPrimitive.Root> & { css?: CSS } & SeparatorVariants
type SeparatorComponent = Polymorphic.ForwardRefComponent<Polymorphic.IntrinsicElement<typeof SeparatorPrimitive.Root>, SeparatorOwnProps>

const Separator = React.forwardRef((props, forwardedRef) => {
	return <StyledSeparator {...props} ref={forwardedRef} />
}) as SeparatorComponent

const Test0 = (
	<StyledSeparator
		as="a"
		href=""
		onMouseDown={(e) => {
			return e
		}}
		onClick={(e) => {
			return e
		}}
		css={{ backdropFilter: 'inherit', backgroundColor: '', color: '$gray900' }}
	>
		hello
	</StyledSeparator>
)

// token:
void theme.colors.gray100.scale
void theme.colors.gray100.value
void theme.colors.gray100.token
void theme.colors.gray100.computedValue
void theme.colors.gray100.variable
void theme.colors.gray100

const themeClass = theme('dark', {})
const sharedColor: CSS = {
	'backgroundColor': 'red',
	'fwefwe': {
		'@bp1': {
			backgroundColor: 'ActiveCaption',
		},
	},
	'@bp1': {
		backgroundColor: 'purple',
	},
}

const Button = styled('button', {
	variants: {
		isDisabled: {
			true: {},
			false: {},
		},
		variant: {
			red: {
				color: '$gray200',
			},
			blue: {
				color: '$gray200',
			},
		},
	},
	defaultVariants: {
		isDisabled: 'false',
	},
	compoundVariants: [
		{
			variant: 'blue',
			css: {
				backgroundColor: '$gray200',
			},
		},
	],
})

const ExtendedButton = styled(Button, {
	variants: {
		variant: {
			green: {
				color: 'ActiveBorder',
				backgroundColor: 'ActiveCaption',
			},
		},
	},
})

const Box = styled('div', {})

const ReactComponent: React.FC<{ fromReact?: boolean }> = (props) => <div></div>

const StitchesExtendingReactComponent = styled(ReactComponent, {
	backgroundColor: 'red',
	backgroundOrigin: 'border-box',
	backdropFilter: 'inherit',
	variants: {
		fromStitches: {
			true: {},
			false: {},
		},
	},
})

type Props = React.ComponentProps<typeof StitchesExtendingReactComponent>

/* -------------------------------------------------------------------------------------------------
 * Extended Button using react utilities without polymorphism
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButtonUsingReactUtils = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>((props, forwardedRef) => {
	return <Button />
})

type LinkProps = React.ComponentProps<'a'> & {
	isPrimary?: boolean
	onToggle?(open: boolean): void
	isDisabled?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
	const { children, isPrimary, ...linkProps } = props
	return (
		<a className={isPrimary ? 'primary' : undefined} ref={ref} {...linkProps}>
			{children}
		</a>
	)
})

/* -----------------------------------------------------------------------------------------------*/
function Test() {
	return (
		<>
			{/* Link accepts onToggle prop */}
			<Link
				onToggle={(open) => {
					void open
				}}
			/>

			{/* Link accepts isPrimary prop */}
			<Link isPrimary />

			<Box as={Button} form="">
				hello
			</Box>

			{/* Button does not accept href prop */}
			{/* @ts-expect-error */}
			<Button as="div" href="" />

			{/* Button accepts form  prop */}
			<Button
				form="form"
				onClick={(e) => {
					void e
				}}
			/>

			{/* Button accepts css prop */}
			<Button css={{ backgroundColor: 'ActiveCaption', padding: 'inherit', paddingBlock: 'inherit', color: 'ActiveCaption' }} />

			{/* Button accepts isDisabled prop */}
			<Button isDisabled />

			{/* Button accepts a responsive variant */}
			<Button variant={{ bp1: 'red' }} css={{ backdropFilter: 'initial', backgroundColor: 'AppWorkspace' }} />

			{/* Button as "a" accepts href prop */}
			<Button as="a" href="" />

			{/* Button as "a" does not accept form prop */}
			{/* @ts-expect-error */}
			<Button as="a" form="form" />

			{/* Button as Link accepts href prop */}
			<Button as={Link} href="#" />

			{/* Button as Link accepts isPrimary prop */}
			<Button as={Link} isPrimary />

			{/* Button as Link accepts variant prop */}
			<Button as={Link} isDisabled />

			{/* Button as Link does not accept form prop */}
			{/* @ts-expect-error */}
			<Button as={Link} form="form" css={{ backgroundColor: 'ActiveCaption' }} />

			{/* Button accepts onClick prop */}
			<Button onClick={(event) => event.currentTarget.form} />

			{/* Button as "a" accepts onClick prop */}
			<Button as="svg" onClick={(event) => event.currentTarget} css={{ backgroundColor: 'ActiveBorder' }} />

			{/* Button as Link accepts onClick prop, but it must be explicitly typed */}
			<Button as={Link} onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => event.altKey} />

			{/* ExtendedButton combines variants */}
			<ExtendedButton variant="green" />
			<ExtendedButton variant="red" />

			{/* ExtendedButton accepts isDisabled prop */}
			<ExtendedButton isDisabled />

			{/* ExtendedButton is typed as a button */}
			<ExtendedButton
				onClick={(e) => {
					void e.currentTarget.form
				}}
			/>

			{/* ExtendedButton as a has a href prop on the currentTraget */}
			<ExtendedButton
				as="a"
				onClick={(e) => {
					void e.currentTarget.href
				}}
			/>

			{/* ExtendedButtonUsingReactUtils accepts isDisabled prop */}
			<ExtendedButtonUsingReactUtils variant="red" />

			{/* ExtendedButtonUsingReactUtils accepts onClick prop */}
			<ExtendedButtonUsingReactUtils onClick={(event) => event.currentTarget.form} />

			{/* ExtendedButtonUsingReactUtils does not accept as prop */}
			{/* @ts-expect-error */}
			<ExtendedButtonUsingReactUtils as="a" isDisabled />

			{/** As works on extended element */}
			<StitchesExtendingReactComponent
				as="a"
				href="fwef"
				onClick={(e) => {
					void e
				}}
			/>

			<StitchesExtendingReactComponent fromReact fromStitches />
			{/** As errors on extended element when passed a wrong prop */}
			{/* @ts-expect-error */}
			<StitchesExtendingReactComponent href="fwef" />
		</>
	)
}
