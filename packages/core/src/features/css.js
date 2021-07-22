import { $$composers } from '../utility/composers.js'
import { createMemo } from '../utility/createMemo.js'
import { define } from '../utility/define.js'
import { hasNames } from '../utility/hasNames.js'
import { hasOwn } from '../utility/hasOwn.js'

import { toCssRules } from '../convert/toCssRules.js'
import { toHash } from '../convert/toHash.js'
import { toTailDashed } from '../convert/toTailDashed.js'

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

/** @typedef {import('../createSheet').SheetGroup} SheetGroup */

const createComponentFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createComponentFunction = (/** @type {Config} */ config, /** @type {SheetGroup} */ sheet) =>
	createComponentFunctionMap(config, () => (...args) => {
		/** @type {string | Function} Component type, which may be a function or a string. */
		let componentType = null

		/** @type {Set<Composer>} Composers. */
		const composers = new Set()

		for (const arg of args) {
			// skip any void argument
			if (arg == null) continue

			switch (typeof arg) {
				case 'function':
					// allow a composer-less function to be the component type
					if (componentType == null && !arg[$$composers]) {
						componentType = arg

						break
					}

				case 'object':
					// allow a type property to be this component type
					if (componentType == null && arg.type != null) componentType = arg.type

					// copy all composers into this component
					if ($$composers in arg)
						for (const composer of arg[$$composers]) {
							composers.add(composer)
						}
					// otherwise, add a new composer to this component
					else if (!('$$typeof' in arg)) {
						const composer = createComposer(arg, config)

						composers.add(composer)
					}

					break

				case 'string':
					componentType = arg
			}
		}

		// set the component type if none was set
		if (componentType == null) componentType = 'span'
		if (!composers.size) composers.add(['PJLV', {}, [], [], {}, []])

		return createRenderer(config, componentType, composers, sheet)
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
} // prettier-ignore

const createRenderer = (
	/** @type {Config} */ config,
	/** @type {string | Function} */ type,
	/** @type {Set<Composer>} */ composers,
	/** @type {import('../createSheet').SheetGroup} */ sheet
) => {
	const [
		initialClassName,
		baseClassNames,
		prefilledVariants,
		undefinedVariants
	] = getPreparedDataFromComposers(composers)

	const selector = `.${initialClassName}`

	/** @type {Render} */
	const render = (props) => {
		props = typeof props === 'object' && props || emptyProps

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

		for (const [composerBaseClass, composerBaseStyle, singularVariants, compoundVariants] of composers) {
			if (!sheet.rules.styled.cache.has(composerBaseClass)) {
				sheet.rules.styled.cache.add(composerBaseClass)

				toCssRules(composerBaseStyle, [`.${composerBaseClass}`], [], config, cssText => {
					sheet.rules.styled.apply(cssText)
				})
			}

			const singularVariantsToAdd = getTargetVariantsToAdd(singularVariants, variantProps, config.media)
			const compoundVariantsToAdd = getTargetVariantsToAdd(compoundVariants, variantProps, config.media, true)

			for (const variantToAdd of singularVariantsToAdd) {
				if (variantToAdd === undefined) continue

				for (const [vClass, vStyle] of variantToAdd) {
					const variantClassName = `${composerBaseClass}-${toHash(vStyle)}-${vClass}`

					classSet.add(variantClassName)

					if (!sheet.rules.onevar.cache.has(variantClassName)) {
						sheet.rules.onevar.cache.add(variantClassName)

						toCssRules(vStyle, [`.${variantClassName}`], [], config, cssText => {
							sheet.rules.onevar.apply(cssText)
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

						toCssRules(vStyle, [`.${variantClassName}`], [], config, cssText => {
							sheet.rules.allvar.apply(cssText)
						})
					}
				}
			}
		}

		// apply css property styles
		if (typeof css === 'object' && css) {
			/** @type {string} Inline Class Unique Identifier. @see `{COMPOSER_UUID}-i{VARIANT_UUID}-css` */
			const iClass = `${initialClassName}-i${toHash(css)}-css`

			classSet.add(iClass)

			if (!sheet.rules.inline.cache.has(iClass)) {
				sheet.rules.inline.cache.add(iClass)

				toCssRules(css, [`.${iClass}`], [], config, cssText => {
					sheet.rules.inline.apply(cssText)
				})
			}
		}

		for (const propClassName of String(props.className || '').trim().split(/\s+/)) {
			if (propClassName) classSet.add(propClassName)
		}

		const renderedClassName = forwardProps.className = [ ...classSet ].join(' ')

		const renderedToString = () => renderedClassName

		return {
			type,
			className: renderedClassName,
			selector,
			props: forwardProps,
			toString: renderedToString,
		}
	}

	const toString = () => {
		if (!sheet.rules.styled.cache.has(initialClassName)) render()
		return initialClassName
	}

	return define(render, {
		type,
		className: initialClassName,
		selector,
		[$$composers]: composers,
		toString,
	})
} // prettier-ignore

/** Returns useful data that can be known before rendering. */
const getPreparedDataFromComposers = (/** @type {Set<Composer>} */ composers) => {
	/** Class name of the first composer. */
	let initialClassName = ''

	/** @type {string[]} Combined class names for all composers. */
	const combinedClassNames = []

	/** @type {PrefilledVariants} Combined variant pairings for all composers. */
	const combinedPrefilledVariants = {}

	/** @type {UndefinedVariants} List of variant names that can have an "undefined" pairing. */
	const combinedUndefinedVariants = []

	for (const [className, , , , prefilledVariants, undefinedVariants] of composers) {
		if (initialClassName === '') initialClassName = className

		combinedClassNames.push(className)

		combinedUndefinedVariants.push(...undefinedVariants)

		for (const name in prefilledVariants) {
			const data = prefilledVariants[name]
			if (combinedPrefilledVariants[name] === undefined || data !== 'undefined' || undefinedVariants.includes(data)) combinedPrefilledVariants[name] = data
		}
	}

	/** @type {[string, string[], PrefilledVariants, Set<UndefinedVariants>]} */
	const preparedData = [
		initialClassName,
		combinedClassNames,
		combinedPrefilledVariants,
		new Set(combinedUndefinedVariants)
	]

	return preparedData
} // prettier-ignore

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

				for (const query in pPair) {
					if (vPair === String(pPair[query])) {
						if (query !== '@initial') {
							vStyle = {
								[query in media ? media[query] : query]: vStyle,
							}
						}

						vOrder += qOrder

						didMatch = true
					}

					++qOrder
				}

				if (!didMatch) continue targetVariants
			}

			// non-matches
			else continue targetVariants
		}

		;(targetVariantsToAdd[vOrder] = targetVariantsToAdd[vOrder] || []).push([isCompoundVariant ? `cv` : `${vName}-${vMatch[vName]}`, vStyle])
	}

	return targetVariantsToAdd
}

/** Fallback props object used when no props are passed. */
const emptyProps = {}
