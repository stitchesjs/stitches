import * as React from 'react'
import createStyled from '../types/index.d'

const { styled } = createStyled({
	theme: {
		colors: {},
	},
	conditions: {
		large: '',
	},
})

const Button = styled('button', {
	variants: {
		isDisabled: {
			true: {},
			false: {},
		},
		variant: {
			red: {
				backgroundOrigin: '',
			},
		},
	},
})

const ExtendedButton = styled(Button, {
	variants: {
		variant: {
			blue: {
				color: 'ActiveBorder',
				backgroundColor: 'ActiveCaption',
			},
		},
	},
})

const ReactComponent: React.FC = (props) => <div></div>

const StitchesExtendingReactComponent = styled(ReactComponent, {
	backgroundColor: 'red',
	backgroundOrigin: 'border-box',
	backdropFilter: 'inherit',
})

type Props = React.ComponentProps<typeof StitchesExtendingReactComponent>

/* -------------------------------------------------------------------------------------------------
 * Extended Button using react utilities without polymorphism
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButtonUsingReactUtils = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>((props, forwardedRef) => {
	return <Button />
})

/* -------------------------------------------------------------------------------------------------
 * Extended Button using react utilities without polymorphism and inline `as`
 * -----------------------------------------------------------------------------------------------*/
export function ExtendedButtonUsingReactUtilsWithInternalInlineAs(props: React.ComponentProps<typeof Button>) {
	/* Should not error with inline `as` component */
	return <Button as={(_props) => <a {..._props} />} />
}

/* -------------------------------------------------------------------------------------------------
 * Extended Polymorphic Button
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * Normal Link
 * -----------------------------------------------------------------------------------------------*/

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
export function Test() {
	return (
		<>
			{/* Link accepts onToggle prop */}
			<Link onToggle={(open) => console.log(open)} />

			{/* Link accepts isPrimary prop */}
			<Link isPrimary />

			{/* Button does not accept href prop */}
			{/* @ts-expect-error */}
			<Button as="div" href="" />

			{/* Button accepts form  prop */}
			<Button form="form" onClick={(e) => {}} />

			{/* Button accepts css prop */}
			<Button css={{ backgroundColor: 'ActiveCaption', padding: 'inherit' }} />

			{/* Button accepts isDisabled prop */}
			<Button isDisabled />

			{/* Button accepts a responsive variant */}
			<Button variant={{ large: 'red' }} />

			{/* Button as "a" accepts href prop */}
			<Button as="a" href="f" />

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

			{/* ExtendedButton accepts variant prop */}
			<ExtendedButton variant="red" />

			{/* ExtendedButton accepts isDisabled prop */}
			<ExtendedButton isDisabled />

			{/* ExtendedButton is typed as a button */}
			<ExtendedButton
				onClick={(e) => {
					console.log(e.currentTarget.form)
				}}
			/>

			{/* ExtendedButton as a has a href prop on the currentTraget */}
			<ExtendedButton
				as="a"
				onClick={(e) => {
					console.log(e.currentTarget.href)
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
					console.log(e)
				}}
			/>
			{/** As errors on extended element when passed a wrong prop */}
			{/* @ts-expect-error */}
			<StitchesExtendingReactComponent href="fwef" />
		</>
	)
}
