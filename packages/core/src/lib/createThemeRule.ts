import getResolvedStyles from './getResolvedStyles'

function createThemeRule<T extends object>(init?: T) {
	let cachedCssText = null as null | string

	const theme = Object(init) as RuleStyles

	const rule: ThemeRuleType<T> = {
		...theme,
		toString() {
			return rule.className
		},
		get className() {
			rule.sheet?.globalRules?.add(rule)
			const className = rule.root.match(/^\.([\w-]+)$/)
			return className ? (className[1] as string) : ''
		},
		get cssText() {
			rule.sheet?.globalRules?.add(rule)
			if (cachedCssText === null) {
				cachedCssText = getResolvedStyles(
					{
						[rule.root]: {
							theme,
						},
					},
					[],
					[],
					Object(rule.sheet),
				)
			}
			return cachedCssText
		},
		root: ':root',
		sheet: null,
	}

	return rule
}

export default createThemeRule
