export type SheetGroup = {
	sheet: CSSStyleSheet
	rules: {
		themed: RuleGroup
		global: RuleGroup
		styled: RuleGroup
		onevar: RuleGroup
		allvar: RuleGroup
		inline: RuleGroup
	}

	reset(): void
	toString(): string
}

export type RuleGroup = {
	index: number
	group: CSSGroupingRule
	cache: Set<string>

	apply(cssText: string): void
}

export type RuleGroupNames = ['themed', 'global', 'styled', 'onevar', 'allvar', 'inline']
