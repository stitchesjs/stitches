import createCore, { TConditions, TTheme, IConfig, _StyledSheet } from '@stitches/core'
import { StyledInstance } from './types'
import * as React from 'react'

const reactFactory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = ''>(
	init?: IConfig<Conditions, Theme, Utils, Prefix>,
): _StyledSheet<Conditions, Theme, Utils> & { styled: StyledInstance<Conditions, Theme, Utils> } =>
	create(init as any) as any

const create = (init?: StyledSheetFactoryInit | undefined) => {
	const core = createCore(init as any)
	const $$typeof = Symbol.for('react.element')
	const $$styled = Symbol.for('stitches.component')

	core.styled = (type: string | anyobject, init: anyobject) => {
		const component = (Object.assign((props: anyobject) => render(props), {
			[$$styled]: true,
			displayName: 'StitchesComponent',
			rule: type[$$styled] ? core.css(type.rule, init) : core.css(init),
			type: type[$$styled] ? type.type : type,
		}) as unknown) as ReactStyledRule

		const render = ({ as, className: classNameOverride, ref = null, ...init }: anyobject) => {
			const classNameOverrides = String(classNameOverride || '').split(/\s+/)
			const expression = component.rule(init)

			const { classNames, props } = expression

			return {
				$$typeof,
				key: null,
				props: {
					...props,
					className: classNames.concat(classNameOverrides).filter(Boolean).join(' '),
				},
				ref,
				type: as || component.type,
				_owner: null,
			}
		}

		return component
	}

	return core
}

export default reactFactory
