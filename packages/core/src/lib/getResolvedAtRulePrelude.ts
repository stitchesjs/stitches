const getResolvedAtRulePrelude = (prelude: string, sheet: StyledSheet) =>
	prelude.replace(/^when\$([^]+)$/, ($0, $1) => sheet.conditions[$1] || $0)

export default getResolvedAtRulePrelude
