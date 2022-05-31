import { internal } from '../utility/internal.js'
import { createMemo } from '../utility/createMemo.js'
import { define } from '../utility/define.js'
import { hasNames } from '../utility/hasNames.js'
import { hasOwn } from '../utility/hasOwn.js'

import { toCssRules } from '../convert/toCssRules.js'
import { toHash } from '../convert/toHash.js'
import { toTailDashed } from '../convert/toTailDashed.js'
import { createRulesInjectionDeferrer } from '../sheet.js'

/** @typedef {import('./css').Internals} Internals */
/** @typedef {import('./css').Composer} Composer */
/** @typedef {import('./css').Config} Config */
/** @typedef {import('./css').InitComposer} InitComposer */
/** @typedef {import('./css').PrefilledVariants} PrefilledVariants */
/** @typedef {import('./css').Render} Render */
/** @typedef {import('./css').Styling} Styling */
/** @typedef {import('./css').UndefinedVariants} UndefinedVariants */
/** @typedef {import('./css').VariantMatcher} VariantMatcher */
/** @typedef {import('./css').VariantProps} VariantProps */
/** @typedef {import('./css').VariantTuple} VariantTuple */

/** @typedef {import('../sheet').SheetGroup} SheetGroup */

const createCssFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createCssFunction = (/** @type {Config} */ config, /** @type {SheetGroup} */ sheet) =>
	createCssFunctionMap(config, () => (...args) => {
		/** @type {Internals} */
		let internals = {
			type: null,
			composers: new Set(),
		}

		for (const arg of args) {
			// skip any void argument
			if (arg == null) continue

			// conditionally extend the component
			if (arg[internal]) {
				if (internals.type == null) internals.type = arg[internal].type

				for (const composer of arg[internal].composers) {
					internals.composers.add(composer)
				}
			}

			// otherwise, conditionally define the component type
			else if (arg.constructor !== Object || arg.$$typeof) {
				if (internals.type == null) internals.type = arg
			}

			// otherwise, add a new composer to this component
			else {
				internals.composers.add(createComposer(arg, config))
			}
		}

		// set the component type if none was set
		if (internals.type == null) internals.type = 'span'
		if (!internals.composers.size) internals.composers.add(['PJLV', {}, [], [], {}, []])

		return createRenderer(config, internals, sheet)
	})

/** Creates a composer from a configuration object. */
const createComposer = (/** @type {InitComposer} */ { variants: initSingularVariants, compoundVariants: initCompoundVariants, defaultVariants: initDefaultVariants, ...style }, /** @type {Config} */ config) => {
	/** @type {string} Composer Unique Identifier. @see `{CONFIG_PREFIX}-?c-{STYLE_HASH}` */
	const className = `${toTailDashed(config.prefix)}c-${toHash(style)}`

	/** @type {VariantTuple[]} */
	const singularVariants = []

	/** @type {VariantTuple[]} */
	const compoundVariants = []

	/** @type {PrefilledVariants} */
	const prefilledVariants = Object.create(null)

	/** @type {UndefinedVariants} */
	const undefinedVariants = []

	for (const variantName in initDefaultVariants) {
		prefilledVariants[variantName] = String(initDefaultVariants[variantName])
	}

	// add singular variants
	if (typeof initSingularVariants === 'object' && initSingularVariants) {
		for (const name in initSingularVariants) {
			if (!hasOwn(prefilledVariants, name)) prefilledVariants[name] = 'undefined'

			const variantPairs = initSingularVariants[name]

			for (const pair in variantPairs) {
				/** @type {VariantMatcher} */
				const vMatch = { [name]: String(pair) }

				if (String(pair) === 'undefined') undefinedVariants.push(name)

				const vStyle = variantPairs[pair]

				/** @type {VariantTuple} */
				const variant = [vMatch, vStyle, !hasNames(vStyle)]

				singularVariants.push(variant)
			}
		}
	}

	// add compound variants
	if (typeof initCompoundVariants === 'object' && initCompoundVariants) {
		for (const compoundVariant of initCompoundVariants) {
			/** @type {InitComposer['compoundVariants']} */
			let { css: vStyle, ...vMatch } = compoundVariant

			vStyle = typeof vStyle === 'object' && vStyle || {}

			// serialize all compound variant pairs
			for (const name in vMatch) vMatch[name] = String(vMatch[name])

			/** @type {VariantTuple} */
			const variant = [vMatch, vStyle, !hasNames(vStyle)]

			compoundVariants.push(variant)
		}
	}

	return /** @type {Composer} */ ([className, style, singularVariants, compoundVariants, prefilledVariants, undefinedVariants])
}

const createRenderer = (
	/** @type {Config} */ config,
	/** @type {Internals} */ internals,
	/** @type {import('../sheet').SheetGroup} */ sheet
) => {
	const [
		baseClassName,
		baseClassNames,
		prefilledVariants,
		undefinedVariants
	] = getPreparedDataFromComposers(internals.composers)

	const deferredInjector = typeof internals.type === 'function' || !!internals.type.$$typeof ? createRulesInjectionDeferrer(sheet) : null
	const injectionTarget = (deferredInjector || sheet).rules

	const selector = `.${baseClassName}${baseClassNames.length > 1 ? `:where(.${baseClassNames.slice(1).join('.')})` : ``}`

	/** @type {Render} */
	const render = (props) => {
		props = typeof props === 'object' && props || empty

		// 1. we cannot mutate `props`
		// 2. we delete variant props
		// 3. we delete `css` prop
		// therefore: we must create a new props & css variables
		const { css, ...forwardProps } = props

		/** @type {VariantProps} */
		const variantProps = {}

		for (const name in prefilledVariants) {
			delete forwardProps[name]

			if (name in props) {
				let data = props[name]

				if (typeof data === 'object' && data) {
					variantProps[name] = {
						'@initial': prefilledVariants[name],
						...data,
					}
				} else {
					data = String(data)

					variantProps[name] = (
						data === 'undefined' && !undefinedVariants.has(name)
							? prefilledVariants[name]
						: data
					)
				}
			} else {
				variantProps[name] = prefilledVariants[name]
			}
		}

		const classSet = new Set([ ...baseClassNames ])

		// 1. builds up the variants (fills in defaults, calculates @initial on responsive, etc.)
		// 2. iterates composers
		// 2.1. add their base class
		// 2.2. iterate their variants, add their variant classes
		// 2.2.1. orders regular variants before responsive variants
		// 2.3. iterate their compound variants, add their compound variant classes

		for (const [composerBaseClass, composerBaseStyle, singularVariants, compoundVariants] of internals.composers) {
			if (!sheet.rules.styled.cache.has(composerBaseClass)) {
				sheet.rules.styled.cache.add(composerBaseClass)

				toCssRules(composerBaseStyle, [`.${composerBaseClass}`], [], config, (cssText) => {
					injectionTarget.styled.apply(cssText)
				})
			}

			const singularVariantsToAdd = getTargetVariantsToAdd(singularVariants, variantProps, config.media)
			const compoundVariantsToAdd = getTargetVariantsToAdd(compoundVariants, variantProps, config.media, true)

			for (const variantToAdd of singularVariantsToAdd) {
				if (variantToAdd === undefined) continue

				for (const [vClass, vStyle, isResponsive] of variantToAdd) {
					const variantClassName = `${composerBaseClass}-${toHash(vStyle)}-${vClass}`

					classSet.add(variantClassName)

					const groupCache = (isResponsive ? sheet.rules.resonevar : sheet.rules.onevar ).cache
					/* 
					 * make sure that normal variants are injected before responsive ones
					 * @see {@link https://github.com/stitchesjs/stitches/issues/737|github}
					 */
					const targetInjectionGroup = isResponsive ? injectionTarget.resonevar : injectionTarget.onevar

					if (!groupCache.has(variantClassName)) {
						groupCache.add(variantClassName)
						toCssRules(vStyle, [`.${variantClassName}`], [], config, (cssText) => {
							targetInjectionGroup.apply(cssText)
						})
					}
				}
			}

			for (const variantToAdd of compoundVariantsToAdd) {
				if (variantToAdd === undefined) continue

				for (const [vClass, vStyle] of variantToAdd) {
					const variantClassName = `${composerBaseClass}-${toHash(vStyle)}-${vClass}`

					classSet.add(variantClassName)

					if (!sheet.rules.allvar.cache.has(variantClassName)) {
						sheet.rules.allvar.cache.add(variantClassName)

						toCssRules(vStyle, [`.${variantClassName}`], [], config, (cssText) => {
							injectionTarget.allvar.apply(cssText)
						})
					}
				}
			}
		}

		// apply css property styles
		if (typeof css === 'object' && css) {
			/** @type {string} Inline Class Unique Identifier. @see `{COMPOSER_UUID}-i{VARIANT_UUID}-css` */
			const iClass = `${baseClassName}-i${toHash(css)}-css`

			classSet.add(iClass)

			if (!sheet.rules.inline.cache.has(iClass)) {
				sheet.rules.inline.cache.add(iClass)

				toCssRules(css, [`.${iClass}`], [], config, (cssText) => {
					injectionTarget.inline.apply(cssText)
				})
			}
		}

		for (const propClassName of String(props.className || '').trim().split(/\s+/)) {
			if (propClassName) classSet.add(propClassName)
		}

		const renderedClassName = forwardProps.className = [ ...classSet ].join(' ')

		const renderedToString = () => renderedClassName

		return {
			type: internals.type,
			className: renderedClassName,
			selector,
			props: forwardProps,
			toString: renderedToString,
			deferredInjector,
		}
	}

	const toString = () => {
		if (!sheet.rules.styled.cache.has(baseClassName)) render()

		return baseClassName
	}

	return define(render, {
		className: baseClassName,
		selector,
		[internal]: internals,
		toString,
	})
}

/** Returns useful data that can be known before rendering. */
const getPreparedDataFromComposers = (/** @type {Set<Composer>} */ composers) => {
	/** Class name of the first composer. */
	let baseClassName = ''

	/** @type {string[]} Combined class names for all composers. */
	const baseClassNames = []

	/** @type {PrefilledVariants} Combined variant pairings for all composers. */
	const combinedPrefilledVariants = {}

	/** @type {UndefinedVariants} List of variant names that can have an "undefined" pairing. */
	const combinedUndefinedVariants = []

	for (const [className, , , , prefilledVariants, undefinedVariants] of composers) {
		if (baseClassName === '') baseClassName = className

		baseClassNames.push(className)

		combinedUndefinedVariants.push(...undefinedVariants)

		for (const name in prefilledVariants) {
			const data = prefilledVariants[name]
			if (combinedPrefilledVariants[name] === undefined || data !== 'undefined' || undefinedVariants.includes(data)) combinedPrefilledVariants[name] = data
		}
	}

	/** @type {[string, string[], PrefilledVariants, Set<UndefinedVariants>]} */
	const preparedData = [
		baseClassName,
		baseClassNames,
		combinedPrefilledVariants,
		new Set(combinedUndefinedVariants)
	]

	return preparedData
}

const getTargetVariantsToAdd = (
	/** @type {VariantTuple[]} */
	targetVariants,
	/** @type {VariantProps} */
	variantProps,
	/** @type {Config['media']} */
	media,
	/** @type {boolean} */
	isCompoundVariant,
) => {
	/** @type {[string, Styling][][]} */
	const targetVariantsToAdd = []

	targetVariants: for (let [vMatch, vStyle, vEmpty] of targetVariants) {
		// skip empty variants
		if (vEmpty) continue

		/** Position the variant should be inserted into. */
		let vOrder = 0

		/** @type {string & keyof typeof vMatch} */
		let vName

		let isResponsive = false
		for (vName in vMatch) {
			const vPair = vMatch[vName]

			let pPair = variantProps[vName]

			// exact matches
			if (pPair === vPair) continue
			// responsive matches
			else if (typeof pPair === 'object' && pPair) {
				/** @type {boolean} Whether the responsive variant is matched. */
				let didMatch

				let qOrder = 0
				// media queries matching the same variant
				let matchedQueries
				for (const query in pPair) {
					if (vPair === String(pPair[query])) {
						if (query !== '@initial') {
							// check if the cleanQuery is in the media config and then we push the resulting media query to the matchedQueries array, 
							// if not, we remove the @media from the beginning and push it to the matched queries which then will be resolved a few lines down
							// when we finish working on this variant and want wrap the vStyles with the matchedQueries
							const cleanQuery = query.slice(1);
							(matchedQueries = matchedQueries || []).push(cleanQuery in media ? media[cleanQuery] : query.replace(/^@media ?/, ''))
							isResponsive = true
						}

						vOrder += qOrder
						didMatch = true
					}

					++qOrder
				}
				if (matchedQueries && matchedQueries.length) {
					vStyle = {
						['@media ' + matchedQueries.join(', ')]: vStyle,
					}
				}

				if (!didMatch) continue targetVariants
			}

			// non-matches
			else continue targetVariants
		}
		(targetVariantsToAdd[vOrder] = targetVariantsToAdd[vOrder] || []).push([isCompoundVariant ? `cv` : `${vName}-${vMatch[vName]}`, vStyle, isResponsive])
	}

	return targetVariantsToAdd
}

/** Fallback props object used when no props are passed. */
const empty = {}
