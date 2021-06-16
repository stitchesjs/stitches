import { Config } from '../createCss'
import { Narrow, PlainObject, Try } from '../utility'
import { NestableStyles } from './NestableStyles'

/** Creates new component styles with the specified styles and variants, and returns a new function to activate them. */
export type CreateComponent<C extends Config = Config> = <T extends CreateComponentInit<C, T> = CreateComponentInit>(
	init?: T
) => Component<C, ComponentConfig<C, T>> // prettier-ignore

export type VariantsDefault = {
	[name: string]: {
		[pair: string]: PlainObject
	}
}

export type CreateComponentInit<C extends Config = Config, T extends PlainObject = {}> = NestableStyles<C, T> & {
	variants?: VariantsDefault
}

export type ComponentConfig<C extends Config = Config, T extends CreateComponentInit = CreateComponentInit> = {
	[K in keyof T]: K extends 'variants' ? Try<T['variants'], VariantsDefault, {}> : T[K]
}

export type Component<C extends Config = Config, T extends ComponentConfig<C, T> = ComponentConfig<C, {}>> = {
	<P extends ComponentRenderProps<C, T, P> = ComponentRenderProps>(props: P): {
		className: string
		selector: string
	}
	className: string
	selector: string
}

export type ComponentRenderProps<
	C extends Config = Config,
	T extends ComponentConfig = ComponentConfig,
	P extends PlainObject = {}
> = {
	[K in keyof P]: K extends keyof T['variants']
		? keyof T['variants'][K]
	: P[K]
} // prettier-ignore
