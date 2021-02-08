import * as React from 'react'
import createStyled from '../types/index.d'
import * as Stitches from '../types/index.d'

const { styled } = createStyled({ conditions: {} })

const Button = styled('button', {
	variants: {
		isDisabled: {
			true: {},
		},
		another: {
			1: {},
			2: {},
		},
	},
})

/* -------------------------------------------------------------------------------------------------
 * Extended Button using react utilities without polymorphism
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButtonUsingReactUtils = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>((props, forwardedRef) => {
	return <Button another={{}} />
})

/* -------------------------------------------------------------------------------------------------
 * Extended Button using react utilities without polymorphism and inline `as`
 * -----------------------------------------------------------------------------------------------*/
export function ExtendedButtonUsingReactUtilsWithInternalInlineAs(props: React.ComponentProps<typeof Button>) {
	/* Should not error with inline `as` component */
	return <Button as={(propss) => <a {...propss} />} />
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
Button({
	css: {},
	onClick: (e) => {
		console.log(e)
	},
	isDisabled: true,
})
export function Test() {
	return (
		<>
			{/* Link accepts onToggle prop */}
			<Link onToggle={(open) => console.log(open)} />

			{/* Link accepts isPrimary prop */}
			<Link isPrimary />

			{/* Button does not accept href prop */}
			<Button isDisabled="true"  onMouseDown={e => {
				console.log(e.altKey)
			}}  onClick={e => {
				console.log(e)
			}} />

			{/* Button accepts form prop */}
			<Button form="form" onClick={(e) => {}} />

			{/* Button accepts css prop */}
			<Button as="a" href="wfefwe" css={{ backgroundColor: 'ActiveCaption', padding: 'inherit' }} />

			{/* Button accepts isDisabled prop */}
			<Button isDisabled />

			{/* Button as "a" accepts href prop */}
			<Button as="a" href="#" />

			{/* Button as "a" does not accept form prop */}
			{/* @ts-expect-error */}
			<Button as="a" form="form" />

			{/* Button as Link accepts href prop */}
			<Button as={Link} href="#" />

			{/* Button as Link accepts isPrimary prop */}
			<Button as={Link} isPrimary />

			{/* Button as Link accepts isDisabled prop */}
			<Button as={Link} isDisabled />

			{/* Button as Link does not accept form prop */}
			{/* @ts-expect-error */}
			<Button as={Link} form="form" css={{ backgroundColor: 'ActiveCaption' }} />

			{/* Button accepts onClick prop */}
			<Button onClick={(event) => event.currentTarget.form} />

			{/* Button as "a" accepts onClick prop */}
			<Button as="a" onClick={(event) => event.currentTarget.href} />

			{/* Button as Link accepts onClick prop, but it must be explicitly typed */}
			<Button as={Link} onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => event.altKey} />

			{/* ExtendedButtonUsingReactUtils accepts isDisabled prop */}
			<ExtendedButtonUsingReactUtils isDisabled />

			{/* ExtendedButtonUsingReactUtils accepts onClick prop */}
			<ExtendedButtonUsingReactUtils onClick={(event) => event.currentTarget.form} />

			{/* ExtendedButtonUsingReactUtils does not accept as prop */}
			{/* @ts-expect-error */}
			<ExtendedButtonUsingReactUtils as="a" isDisabled />
		</>
	)
}
