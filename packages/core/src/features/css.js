import { $$composers } from '../utility/composers.js'
import { createMemo } from '../utility/createMemo.js'
import { define } from '../utility/define.js'
import { hasNames } from '../utility/hasNames.js'
import { hasOwn } from '../utility/hasOwn.js'

import { toCssRules } from '../convert/toCssRules.js'
import { toHash } from '../convert/toHash.js'
import { toTailDashed } from '../convert/toTailDashed.js'

/** @typedef {import('.').Config} Config */
/** @typedef {import('.').Style} Style */
/** @typedef {import('.').Group} Group */
/** @typedef {import('.').GroupRules} GroupRules */
/** @typedef {import('.').GroupSheet} GroupSheet */

/** @typedef {[string, {}, Variant[], { [name: string]: any }], Variant[], Variant[]} Composer */
/** @typedef {{ [name: string]: string }} VariantMatches */
/** @typedef {[VariantMatches, {}]} Variant */

/** @typedef {{ css: Style } & VariantMatches} CompoundVariantsInit */
/** @typedef {{ [name: string]: any }} DefaultVariants */
/** @typedef {{ [name: string]: { [value: string]: Style } }} SingularVariantsInit */
/** @typedef {{ variants: SingularVariantsInit, compoundVariants: CompoundVariantsInit, defaultVariants: DefaultVariants } & Style} ComposerInit */

const createComponentFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createComponentFunction = (/** @type {Config} */ config, /** @type {GroupSheet} */ sheet) =>
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
		if (!composers.size) composers.add(['PJLV', {}, [], Object.create(null), [], [], []])

		return createRenderer(config, componentType, composers, sheet)
	})

/** Creates a composer from a configuration object. */
const createComposer = (/** @type {ComposerInit} */ { variants: singularVariants, compoundVariants, defaultVariants, ...style }, /** @type {Config} */ config) => {
	/** @type {string} Composer Unique Identifier. @see `{CONFIG_PREFIX}-?c-{STYLE_HASH}` */
	const className = `${toTailDashed(config.prefix)}c-${toHash(style)}`

	/** @type {Variant[]} */
	const variants = []

	const composerSingularVariants = []
	const composerCompoundVariants = []
	const processedDefaultVariants = Object.create(null)
	const canHaveUndefinedVariants = []

	for (const variantName in defaultVariants) {
		processedDefaultVariants[variantName] = String(defaultVariants[variantName])
	}

	// add singular variants
	if (typeof singularVariants === 'object' && singularVariants) {
		for (const name in singularVariants) {
			if (!hasOwn(processedDefaultVariants, name)) processedDefaultVariants[name] = 'undefined'

			const variantPairs = singularVariants[name]

			for (const pair in variantPairs) {
				/** @type {VariantMatches} */
				const vMatch = { [name]: String(pair) }

				if (String(pair) === 'undefined') canHaveUndefinedVariants.push(name)

				/** @type {Style} */
				const vStyle = variantPairs[pair]

				/** @type {Variant} */
				const variant = [vMatch, vStyle]

				variants.push(variant)

				composerSingularVariants.push([
					vMatch,
					vStyle,
				])
			}
		}
	}

	// add compound variants
	if (typeof compoundVariants === 'object' && compoundVariants) {
		for (const compoundVariant of compoundVariants) {
			let { css: vStyle, ...vMatch } = compoundVariant

			vStyle = (typeof vStyle === 'object' && vStyle) || {}

			for (const name in vMatch) vMatch[name] = String(vMatch[name])

			/** @type {Variant} */
			const variant = [vMatch, vStyle]

			variants.push(variant)

			composerCompoundVariants.push([
				vMatch,
				vStyle,
			])
		}
	}

	return /** @type {Composer} */ ([className, style, variants, processedDefaultVariants, composerSingularVariants, composerCompoundVariants, canHaveUndefinedVariants])
} // prettier-ignore

const createRenderer = (
	/** @type {Config} */ config,
	/** @type {string | Function} */ type,
	/** @type {Set<Composer>} */ composers,
	/** @type {GroupSheet} */ sheet
) => {
	const [className] = composers.keys().next().value
	const selector = `.${className}`

	const render = (props) => {
		props = (typeof props === 'object' && props) || {}

		const { css, ...forwardProps } = props

		let comparablePropsLead = {}
		let comparablePropsTail = { ...forwardProps }

		const [defaultVariants, canHaveUndefinedVariants] = getDefaultVariantsFromComposers(composers)

		for (const name in defaultVariants) {
			if (name in comparablePropsTail) {
				let propData = comparablePropsTail[name]

				if (typeof propData === 'object' && propData !== null) {
					comparablePropsTail[name] = {
						'@initial': defaultVariants[name],
						...propData,
					}
					continue
				}

				propData = String(propData)

				if (propData === 'undefined' && !canHaveUndefinedVariants.has(name)) {
					comparablePropsTail[name] = defaultVariants[name]
				}
			} else {
				comparablePropsLead[name] = defaultVariants[name]
			}
		}

		const { children, ...comparableProps } = { ...comparablePropsLead, ...comparablePropsTail }

		/** @type {string[]} */
		const classSet = new Set

		for (const [composerClassName, composerStyle, composerVariants, _, composerSingularVariants, composerCompoundVariants] of composers) {
			classSet.add(composerClassName)

			if (!sheet.rules.styled.cache.has(composerClassName)) {
				sheet.rules.styled.cache.add(composerClassName)

				let index = sheet.rules.styled.group.cssRules.length

				toCssRules(composerStyle, [`.${composerClassName}`], [], config, cssText => {
					sheet.rules.styled.group.insertRule(cssText, index++)
				})
			}

			const singularVariantsToAdd = []
			const compoundVariantsToAdd = []

			singularVariants: for (let [vMatch, vStyle] of composerSingularVariants) {
				// skip empty variants
				if (!hasNames(vStyle)) continue

				let variantIndex = 0

				for (const name in vMatch) {
					delete forwardProps[name]

					const matchingPair = vMatch[name]

					let comparablePair = comparableProps[name]

					comparablePair = typeof comparablePair === 'object' && comparablePair || String(comparablePair)

					// exact matches
					if (comparablePair === matchingPair) continue

					// responsive matches
					else if (name in comparableProps && typeof comparablePair === 'object' && comparablePair !== null) {
						let didMatch = false

						for (const query in comparablePair) {
							if (String(comparablePair[query]) === matchingPair) {
								if (query !== '@initial') {
									vStyle = {
										[query in config.media ? config.media[query] : query]: vStyle
									}
								}

								variantIndex += Object.keys(comparablePair).indexOf(query)

								didMatch = true
							}
						}

						if (!didMatch) continue singularVariants
					}

					// non-matches
					else continue singularVariants
				}

				const vName = String(Object.keys(vMatch))
				const vClass = `${vName}-${vMatch[vName]}`

				;(singularVariantsToAdd[variantIndex] = singularVariantsToAdd[variantIndex] || []).push([vClass, vStyle])
			}

			compoundVariants: for (let [vMatch, vStyle] of composerCompoundVariants) {
				// skip empty variants
				if (!hasNames(vStyle)) continue

				let variantIndex = 0

				for (const name in vMatch) {
					delete forwardProps[name]

					const matchingPair = vMatch[name]

					let comparablePair = comparableProps[name]

					comparablePair = typeof comparablePair === 'object' && comparablePair || String(comparablePair)

					// exact matches
					if (comparablePair === matchingPair) continue

					// responsive matches
					else if (name in comparableProps && typeof comparablePair === 'object' && comparablePair !== null) {
						let didMatch = false

						for (const query in comparablePair) {
							if (String(comparablePair[query]) === matchingPair) {
								if (query !== '@initial') {
									vStyle = {
										[query in config.media ? config.media[query] : query]: vStyle
									}
								}

								variantIndex += Object.keys(comparablePair).indexOf(query)

								didMatch = true
							}
						}

						if (!didMatch) continue compoundVariants
					}

					// non-matches
					else continue compoundVariants
				}

				;(compoundVariantsToAdd[variantIndex] = compoundVariantsToAdd[variantIndex] || []).push(vStyle)
			}

			for (const variantToAdd of singularVariantsToAdd) {
				if (variantToAdd === undefined) continue

				for (const [vClass, vStyle] of variantToAdd) {
					const variantClassName = `${composerClassName}-${toHash(vStyle)}-${vClass}`

					classSet.add(variantClassName)

					if (!sheet.rules.onevar.cache.has(variantClassName)) {
						sheet.rules.onevar.cache.add(variantClassName)

						let index = sheet.rules.onevar.group.cssRules.length

						toCssRules(vStyle, [`.${variantClassName}`], [], config, cssText => {
							sheet.rules.onevar.group.insertRule(cssText, index++)
						})
					}
				}
			}

			for (const variantToAdd of compoundVariantsToAdd) {
				if (variantToAdd === undefined) continue

				for (const vStyle of variantToAdd) {
					const variantClassName = `${composerClassName}-${toHash(vStyle)}-cv`

					classSet.add(variantClassName)

					if (!sheet.rules.allvar.cache.has(variantClassName)) {
						sheet.rules.allvar.cache.add(variantClassName)

						let index = sheet.rules.allvar.group.cssRules.length

						toCssRules(vStyle, [`.${variantClassName}`], [], config, cssText => {
							sheet.rules.allvar.group.insertRule(cssText, index++)
						})
					}
				}
			}
		}

		// apply css property styles
		if (typeof css === 'object' && css) {
			/** @type {string} Inline Class Unique Identifier. @see `{COMPOSER_UUID}-i{VARIANT_UUID}-css` */
			const iClass = `${className}-i${toHash(css)}-css`

			classSet.add(iClass)

			if (!sheet.rules.inline.cache.has(iClass)) {
				sheet.rules.inline.cache.add(iClass)

				let index = sheet.rules.inline.group.cssRules.length

				toCssRules(css, [`.${iClass}`], [], config, cssText => {
					sheet.rules.inline.group.insertRule(cssText, index++)
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
		if (!sheet.rules.styled.cache.has(className)) render()
		return className
	}

	return define(render, {
		type,
		className,
		selector,
		[$$composers]: composers,
		toString,
	})
} // prettier-ignore

const getDefaultVariantsFromComposers = (/** @type {Set<Composer>} */ composers) => {
	const combinedDefaultVariants = {}

	const combinedCanHaveUndefinedVariants = []

	for (const [, , , defaultVariants, , , canHaveUndefinedVariants] of composers) {
		combinedCanHaveUndefinedVariants.push(...canHaveUndefinedVariants)

		for (const name in defaultVariants) {
			combinedDefaultVariants[name] = defaultVariants[name]
		}
	}

	return [combinedDefaultVariants, new Set(combinedCanHaveUndefinedVariants)]
}
