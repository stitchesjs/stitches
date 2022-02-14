/** @typedef {import('./sheet').RuleGroup} RuleGroup */
/** @typedef {import('./sheet').RuleGroupNames} RuleGroupNames */
/** @typedef {import('./sheet').SheetGroup} SheetGroup */

/**
 * Rules in the sheet appear in this order:
 * 1. theme rules (themed)
 * 2. global rules (global)
 * 3. component rules (styled)
 * 4. non-responsive variants rules (onevar)
 * 5. responsive variants rules (resonevar)
 * 6. compound variants rules (allvar)
 * 7. inline rules (inline)
 */
/** @type {RuleGroupNames} */
export const names = ['themed', 'global', 'styled', 'onevar', 'resonevar', 'allvar', 'inline']

const isSheetAccessible = (/** @type {CSSStyleSheet} */ sheet) => {
	if (sheet.href && !sheet.href.startsWith(location.origin)) {
		return false
	}

	try {
		return !!sheet.cssRules
	} catch (e) {
		return false
	}
}

export const createSheet = (/** @type {DocumentOrShadowRoot} */ root) => {
	/** @type {SheetGroup} Object hosting the hydrated stylesheet. */
	let groupSheet

	const toString = () => {
		const { cssRules } = groupSheet.sheet
		return [].map
			.call(cssRules, (cssRule, cssRuleIndex) => {
				const { cssText } = cssRule

				let lastRuleCssText = ''

				if (cssText.startsWith('--sxs')) return ''

				if (cssRules[cssRuleIndex - 1] && (lastRuleCssText = cssRules[cssRuleIndex - 1].cssText).startsWith('--sxs')) {
					if (!cssRule.cssRules.length) return ''

					for (const name in groupSheet.rules) {
						if (groupSheet.rules[name].group === cssRule) {
							return `--sxs{--sxs:${[...groupSheet.rules[name].cache].join(' ')}}${cssText}`
						}
					}

					return cssRule.cssRules.length ? `${lastRuleCssText}${cssText}` : ''
				}

				return cssText
			})
			.join('')
	}

	const reset = () => {
		if (groupSheet) {
			const { rules, sheet } = groupSheet

			if (!sheet.deleteRule) {
				while (Object(Object(sheet.cssRules)[0]).type === 3) sheet.cssRules.splice(0, 1)

				sheet.cssRules = []
			}

			for (const groupName in rules) {
				delete rules[groupName]
			}
		}

		/** @type {StyleSheetList} */
		const sheets = Object(root).styleSheets || []

		// iterate all stylesheets until a hydratable stylesheet is found
		for (const sheet of sheets) {
			if (!isSheetAccessible(sheet)) continue

			for (let index = 0, rules = sheet.cssRules; rules[index]; ++index) {
				/** @type {CSSStyleRule} Possible indicator rule. */
				const check = Object(rules[index])

				// a hydratable set of rules will start with a style rule (type: 1), ignore all others
				if (check.type !== 1) continue

				/** @type {CSSMediaRule} Possible styling group. */
				const group = Object(rules[index + 1])

				// a hydratable set of rules will follow with a media rule (type: 4), ignore all others
				if (group.type !== 4) continue

				++index

				const { cssText } = check

				// a hydratable style rule will have a selector of `--sxs`, ignore all others
				if (!cssText.startsWith('--sxs')) continue

				const cache = cssText.slice(14, -3).trim().split(/\s+/)

				/** @type {GroupName} Name of the group. */
				const groupName = names[cache[0]]

				// a hydratable style rule will have a parsable group, ignore all others
				if (!groupName) continue

				// create a group sheet if one does not already exist
				if (!groupSheet) groupSheet = { sheet, reset, rules: {}, toString }

				// add the group to the group sheet
				groupSheet.rules[groupName] = { group, index, cache: new Set(cache) }
			}

			// if a hydratable stylesheet is found, stop looking
			if (groupSheet) break
		}

		// if no hydratable stylesheet is found
		if (!groupSheet) {
			const createCSSMediaRule = (/** @type {string} */ sourceCssText, type) => {
				return /** @type {CSSMediaRule} */ ({
					type,
					cssRules: [],
					insertRule(cssText, index) {
						this.cssRules.splice(index, 0, createCSSMediaRule(cssText, {
							import: 3,
							undefined: 1
						}[(cssText.toLowerCase().match(/^@([a-z]+)/) || [])[1]] || 4))
					},
					get cssText() {
						return sourceCssText === '@media{}' ? `@media{${[].map.call(this.cssRules, (cssRule) => cssRule.cssText).join('')}}` : sourceCssText
					},
				})
			}

			groupSheet = {
				sheet: root ? (root.head || root).appendChild(document.createElement('style')).sheet : createCSSMediaRule('', 'text/css'),
				rules: {},
				reset,
				toString,
			}
		}

		const { sheet, rules } = groupSheet
		for (let i = names.length - 1; i >= 0; --i) {
			// name of group on current index
			const name = names[i]
			if (!rules[name]) {
				// name of prev group
				const prevName = names[i + 1]
				// get the index of that prev group or else get the length of the whole sheet
				const index = rules[prevName] ? rules[prevName].index : sheet.cssRules.length
				// insert the grouping & the sxs rule
				sheet.insertRule('@media{}', index)
				sheet.insertRule(`--sxs{--sxs:${i}}`, index)
				// add the group to the group sheet
				rules[name] = { group: sheet.cssRules[index + 1], index, cache: new Set([i]) }
			}
			addApplyToGroup(rules[name])
		}
	}

	reset()

	return groupSheet
}

const addApplyToGroup = (/** @type {RuleGroup} */ group) => {
	const groupingRule = group.group

	let index = groupingRule.cssRules.length

	group.apply = (cssText) => {
		try {
			groupingRule.insertRule(cssText, index)

			++index
		} catch (__) {
			// do nothing and continue
		}
	}
}
/** Pending rules for injection */
const $pr = Symbol()

/** 
 * When a stitches component is extending some other random react component,
 * it’s gonna create a react component (Injector) using this function and then render it after the children, 
 * this way, we would force the styles of the wrapper to be injected after the wrapped component
 */
export const createRulesInjectionDeferrer = (globalSheet) => {
	// the injection deferrer
	function injector() {
		for (let i = 0; i < injector[$pr].length; i++) {
			const [sheet, cssString] = injector[$pr][i]
			globalSheet.rules[sheet].apply(cssString)
		}
		injector[$pr] = []
		return null
	}
	// private prop to store pending rules
	injector[$pr] = []
	// mocking the rules.apply api used on the sheet
	injector.rules = {}
	// creating the apply methods under rules[something]
	names.forEach((sheetName) => (injector.rules[sheetName] = { apply: (rule) => injector[$pr].push([sheetName, rule]) }))
	return injector
}
