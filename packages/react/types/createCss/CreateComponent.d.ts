import { Config } from '../createCss'
import { Narrow } from '../utility'
import { NestableStyles } from './NestableStyles'

/** Creates new component styles with the specified styles and variants, and returns a new function to activate them. */
export type CreateComponent<C extends Config = Config> = <T extends {} = {}>(
	init: NestableStyles<C, T>,
) => {
	<P extends {}>(
		props: Narrow<P>,
	): {
		className: string
		selector: string
	}
	className: string
	selector: string
} // prettier-ignore
