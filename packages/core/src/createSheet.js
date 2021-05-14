/** @typedef {import('.').GroupSheet} GroupSheet */
/** @typedef {import('.').GroupRules} GroupRules */
/** @typedef {import('.').GroupName} GroupName */
/** @typedef {import('.').Group} Group */

/** @type {GroupName[]} */
const names = ['themed', 'global', 'styled', 'varied', 'inline']

export const createSheet = (/** @type {DocumentOrShadowRoot} */ root) => {
	/** @type {GroupSheet} Object hosting the hydrated stylesheet. */
	let groupSheet

	const reset = () => {
		if (groupSheet) {
			const { rules, sheet } = groupSheet

			if (!sheet.deleteRule) {
				while (sheet.cssRules?.[0]?.type === 3) sheet.cssRules.splice(0, 1)

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
		const sheets = root?.styleSheets || []

		// iterate all stylesheets until a hydratable stylesheet is found
		for (const sheet of sheets) {
			for (let index = 0, rules = sheet.cssRules; rules[index]; ++index) {
				/** @type {CSSStyleRule} Possible indicator rule. */
				const check = rules[index]

				// a hydratable set of rules will start with a style rule (type: 1), ignore all others
				if (check?.type !== 1) continue

				/** @type {CSSMediaRule} Possible styling group. */
				const group = rules[index + 1]

				// a hydratable set of rules will follow with a media rule (type: 4), ignore all others
				if (group?.type !== 4) continue

				++index

				const { cssText } = check

				// a hydratable style rule will have a selector of `--stitches`, ignore all others
				if (!cssText.startsWith('--stitches')) continue

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

							if (cssText.startsWith('--stitches')) return ''

							if (cssRules[cssRuleIndex - 1] && (lastRuleCssText = cssRules[cssRuleIndex - 1].cssText).startsWith('--stitches')) {
								if (!cssRule.cssRules.length) return ''

								for (const name in groupSheet.rules) {
									if (groupSheet.rules[name].group === cssRule) {
										return `--stitches{--:${[...groupSheet.rules[name].cache].join(' ')}}${cssText}`
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
			sheet.insertRule('--stitches{--:4}', index)

			rules.inline = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([4]),
			}
		}

		// conditionally generate the varied group
		if (!rules.varied) {
			const index = rules.inline.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--stitches{--:3}', index)

			rules.varied = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([3]),
			}
		}

		// conditionally generate the styled group
		if (!rules.styled) {
			const index = rules.varied.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--stitches{--:2}', index)

			rules.styled = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([2]),
			}
		}

		// conditionally generate the global group
		if (!rules.global) {
			const index = rules.styled.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--stitches{--:1}', index)

			rules.global = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([1]),
			}
		}

		// conditionally generate the themed group
		if (!rules.themed) {
			const index = rules.global.index
			sheet.insertRule('@media{}', index)
			sheet.insertRule('--stitches{--:0}', index)

			rules.themed = {
				index: index,
				group: sheet.cssRules[index + 1],
				cache: new Set([0]),
			}
		}
	}

	reset()

	return groupSheet
}
