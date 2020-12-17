import getHashString from './lib/getHashString'

/** Returns a StyledSheet. */
const createCss = function createCss(init?: StyledSheetFactoryInit) {
	let sheet = Object.create(null)

	sheet.prefix = init?.prefix == null ? '' : String(init.prefix)

	/** Returns a new StyledRule. */
	sheet.css = (...inits: anyobject[]) => {
		const opts = Object.create(null)
		const extensions = Object.create(null)

		for (const init of inits) {
			if ('className' in Object(init)) {
				extensions.add(init)
			} else {
				Object.assign(opts, init)
			}
		}

		const { variants: variantsInit, ...ruleStyles } = opts

		const rule = () => rule.create(...arguments)

		rule.id = getHashString(ruleStyles)
		rule.className = `${sheet.prefix}${rule.id}`
		rule.selector = `.${rule.className}`
		rule.variants = Object.create(null)

		for (const variantName in variantsInit) {
			for (const variantValue in variantsInit[variantName]) {
				const variant = (rule.variants[variantName + ':' + variantValue] = Object.create(null))

				variant.id = getHashString(variantsInit[variantName][variantValue])
				variant.className = `${rule.className}-${variant.id}`
				variant.selector = `.${variant.className}`
				variant.toString = () => variant.className
			}
		}

		rule.create = (init?: anyobject) => {
			const expression = Object.create(null)

			expression.className = rule.className

			for (const variantName in init) {
				const variantKey = variantName + ':' + init[variantName]

				if (variantKey in rule.variants) {
					expression.className += ' ' + rule.variants[variantKey]
				}
			}

			expression.selector = `.${expression.className.replace(/ /g, '.')}`
			expression.toString = () => expression.className
		}

		return rule
	}

	/** Returns a new StyledTheme. */
	sheet.theme = (init: Theme) => {
		const rule = () => {}
		rule.className = getHashString(init)
		rule.selector = `.${rule.className}`
		rule.toString = () => {}

		return rule
	}

	/** Stubbed in Production */
	sheet.clear = sheet.global = sheet.toString = () => {}

	return sheet
}

export default createCss
