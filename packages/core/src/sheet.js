/** @typedef {import('./sheet').RuleGroup} RuleGroup */
/** @typedef {import('./sheet').RuleGroupNames} RuleGroupNames */
/** @typedef {import('./sheet').SheetGroup} SheetGroup */

/** @type {RuleGroupNames} */
const names = ['themed', 'global', 'styled', 'onevar', 'allvar', 'inline']

export const createSheet = (/** @type {DocumentOrShadowRoot} */ root) => {
	/** @type {SheetGroup} Object hosting the hydrated stylesheet. */
	let groupSheet

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

			if (sheet.ownerRule) {
				sheet.ownerRule.textContent = sheet.ownerRule.textContent
			}
		}

		/** @type {StyleSheetList} */
		const sheets = Object(root).styleSheets || []

		// iterate all stylesheets until a hydratable stylesheet is found
		for (const sheet of sheets) {
			if (sheet.href && !sheet.href.startsWith(location.origin)) continue

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

				const cache = cssText.slice(16, -3).trim().split(/\s+/)

				/** @type {GroupName} Name of the group. */
				const groupName = names[cache[0]]

				// a hydratable style rule will have a parsable group, ignore all others
				if (!groupName) continue

				// create a group sheet if one does not already exist
				if (!groupSheet) groupSheet = { sheet, reset, rules: {} }

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
						this.cssRules.splice(index, 0, createCSSMediaRule(cssText, { import: 3, undefined: 1 }[(cssText.toLowerCase().match(/^@([a-z]+)/) || [])[1]] || 4))
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
				toString() {
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
				},
			}
		}

		const { sheet, rules } = groupSheet

		// conditionally generate the inline group
		if (!rules.inline) {
			const index = sheet.cssRules.length
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--sxs{--sxs:5}', index)

			rules.inline = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([5]),
			}
		}
		addApplyToGroup(rules.inline)

		// conditionally generate the allvar group
		if (!rules.allvar) {
			const index = rules.inline.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--sxs{--sxs:4}', index)

			rules.allvar = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([4]),
			}
		}
		addApplyToGroup(rules.allvar)

		// conditionally generate the onevar group
		if (!rules.onevar) {
			const index = rules.allvar.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--sxs{--sxs:3}', index)

			rules.onevar = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([3]),
			}
		}
		addApplyToGroup(rules.onevar)

		// conditionally generate the styled group
		if (!rules.styled) {
			const index = rules.onevar.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--sxs{--sxs:2}', index)

			rules.styled = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([2]),
			}
		}
		addApplyToGroup(rules.styled)

		// conditionally generate the global group
		if (!rules.global) {
			const index = rules.styled.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--sxs{--sxs:1}', index)

			rules.global = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([1]),
			}
		}
		addApplyToGroup(rules.global)

		// conditionally generate the themed group
		if (!rules.themed) {
			const index = rules.global.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--sxs{--sxs:0}', index)

			rules.themed = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([0]),
			}
		}
		addApplyToGroup(rules.themed)
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
		} catch {
			// do nothing and continue
		}
	}
}
