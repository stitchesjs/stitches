import { createStitches } from '../src/index.js'

const styleRule = `--sxs { --sxs:1 lTyTw fJmROo; }`
const mediaRule = `@media { body { margin: auto; }`

const createStylesheet = (...preloadedStyles) => {
	let rules = []
	const insertRule = (rule, index = rules.length) => {
		if (rule.startsWith('--sxs')) {
			rules.splice(index, 0, { type: 1, cssText: rule })
		}
		if (rule.startsWith('@media')) {
			rules.splice(index, 0, { type: 4, cssText: rule, cssRules: [] })
		}
	}
	preloadedStyles.forEach(insertRule)
	return {
		insertRule,
		cssRules: rules,
	}
}

describe('Issue #908', () => {
	test('Getting hydratable stylesheet', () => {
		const { getCssText } = createStitches({
			root: {
				styleSheets: [createStylesheet(styleRule, mediaRule)],
			},
		})

		expect(getCssText()).toBe(mediaRule)
	})
})
