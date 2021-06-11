import { $$composers } from '../../../core/src/utility/composers.js'
import { hasOwn } from '../../../core/src/utility/hasOwn.js'

/** Return the best-matching component type from an unknown type. */
export const getComponentType = (type) => (
	// if type is void, return a span
	type == null ? 'span' :
	// if the type is a non react object, return a span
	typeof type === 'object' && !type.$$typeof ? 'span' :
	// if the type is a styled component, return its inner type
	hasOwn(type, $$composers) ? getComponentType(type.type) :
	// otherwise, return its type
	type
) // prettier-ignore
