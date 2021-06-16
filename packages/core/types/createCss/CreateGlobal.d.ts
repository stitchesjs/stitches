import { Config } from '../createCss'
import { Narrow, PlainObject } from '../utility'
import { TopLevelStyles } from './TopLevelStyles'

/** Creates new global styles with the specified styles, and returns a new function to activate them. */
export type CreateGlobal<C extends Config = Config> = <T extends {} = {}>(
	init: TopLevelStyles<C, T>
) => {
	(): {
		className: string
		selector: string
	}
	className: string
	selector: string
} // prettier-ignore
