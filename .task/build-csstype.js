import * as fs from './internal/fs.js'
import URL from './internal/url.js'

const rootUrl = URL.from(import.meta.url).to('../')
const dtsOriginalURL = rootUrl.to('./node_modules/csstype/index.d.ts')

const generateType = async (packageUrl) => {
	const dtsOriginalTxt = await fs.readFile(dtsOriginalURL, 'utf8')

	const dtsModifiedURL = packageUrl.to('types/css.d.ts')
	console.log(dtsModifiedURL.pathname)

	const dtsModifiedTxt = new ModifiedString(dtsOriginalTxt)
		.withoutVendorTyping

		.withCamelCasedColors

		.withAddedLicense

		.withAddedColorFunctions
		.withFixedColorScheme
		.withFixedFontFamily
		.withFixedMatchingSelector
		.withFixedNestingSelectors
		.withFixedProperties
		.withFixedPropertyAtRule
		.withFixedStretchValue
		.withFixedSystemColor

		.withoutBrowserComments
		.withoutImplicitGlobals
		.withoutPropertyValueTyping
		.withoutGenericTyping
		.withoutNarrowingPatch
		.withoutNeverInChain
		.withoutTrailingSpace
	.toString()

	await fs.writeFile(dtsModifiedURL, dtsModifiedTxt)
}

const generateTypes = async () => {
	await generateType(rootUrl.to('packages/core/'))
	await generateType(rootUrl.to('packages/react/'))
}

class ModifiedString extends String {
	replace(matcher, replacer) {
		replacer = typeof replacer === 'function' ? replacer : replacer
		return new ModifiedString(super.replace(matcher, replacer))
	}

	// with

	get withAddedColorFunctions() {
		return this.replace(
			/"CurrentColor"/g,
			'"CurrentColor" | "hsl(" | "lab(" | "rgb("'
		)
	}

	get withAddedLicense() {
		const licenseComment = `/** @license MIT License\n * Copyright (c) 2017-present, Fredrik Nicol\n * Copyright (c) 2021-present, Jonathan Neal\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n * SOFTWARE.\n */`

		return this.replace(
			/^/,
			`${licenseComment}\n\n`
		)
	}

	get withCamelCasedColors() {
		const cssColorNames = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'CurrentColor', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'].reduce(
			(colors, UpperCamelCaseColorName) =>
				Object.assign(colors, {
					[`"${UpperCamelCaseColorName.toLowerCase()}"`]: `"${UpperCamelCaseColorName}"`,
				}),
			Object.create(null),
		)

		return this.replace(
			RegExp(Object.keys(cssColorNames).join('|'), 'ig'),
			$0 => cssColorNames[$0.toLowerCase()]
		)
	}

	get withFixedColorScheme() {
		return this.replace(
			'type ColorScheme = Globals | "dark" | "light" | "normal"',
			'type ColorScheme = Globals | "dark" | "light" | "light dark" | "normal"'
		)
	}

	get withFixedFontFamily() {
		return this.replace(
			'type GenericFamily = "cursive" | "fantasy" | "monospace" | "sans-serif" | "serif"',
			'type GenericFamily = "cursive" | "emoji" | "fangsong" | "fantasy" | "math" | "monospace" | "sans-serif" | "serif" | "system-ui" | "ui-monospace" | "ui-rounded" | "ui-sans-serif" | "ui-serif"'
		)
	}

	get withFixedNestingSelectors() {
		return this.replace(
			/Pseudos =[\W\w]+?;/g,
			fragment => fragment.replace(
				/":/g,
				'"&:'
			).replace(
				/  \| "&:matches"\n/,
				''
			)
		).replace(
			/AdvancedPseudos =[\W\w]+?;/g,
			fragment => fragment.replace(
				/"&[^"]+/g,
				'$&('
			)
		)
	}

	get withFixedProperties() {
		return this.replace(
			'type ZIndex = Globals | "auto" | (number & {})',
			'type ZIndex = Globals | "auto" | (number & {}) | (string & {})'
		).replace(
			'type LetterSpacing<TLength = (string & {}) | 0> = Globals | TLength | "normal"',
			'type LetterSpacing = Globals | "normal" | (number & {}) | (string & {})'
		).replace(
			/Property.LetterSpacing<TLength>/g,
			'Property.LetterSpacing'
		).replace(
			'FontWeightAbsolute = "bold" | "normal"',
			'FontWeightAbsolute = "bold" | "normal" | (string & {})'
		).replace(
			'DataType.FontWeightAbsolute | (string & {})',
			'DataType.FontWeightAbsolute'
		).replace(
			'FlexGrow = Globals | (number & {})',
			'FlexGrow = Globals | (number & {}) | (string & {})'
		)
	}

	get withFixedPropertyAtRule() {
		return this.replace(
			'type Inherits = "false" | "true";',
			'type Inherits = "false" | "true" | boolean;'
		).replace(
			'initialValue?: string;',
			'initialValue?: boolean | number | string',
		)
	}

	get withFixedMatchingSelector() {
		return this.replace(
			/matches\(\)/g,
			'matches'
		)
	}

	get withFixedStretchValue() {
		return this.replace(
			/(\n +\| +)?"fit-content"/g,
			($0, $1) => $1 ? `${$1}"stretch"${$1}"fit-content"` : '"stretch" | "fit-content"'
		)
	}

	get withFixedSystemColor() {
		return this.replace(
			/type DeprecatedSystemColor[^;]+;/,
			'type DeprecatedSystemColor = "ActiveText" | "ButtonFace" | "ButtonText" | "ButtonBorder" | "Canvas" | "CanvasText" | "Field" | "FieldText" | "GrayText" | "Highlight" | "HighlightText" | "LinkText" | "Mark" | "MarkText" | "VisitedText"'
		).replace(
			/DeprecatedSystemColor/g,
			'SystemColor'
		)
	}

	// without

	get withoutGenericTyping() {
		return this.replace(
			/\n? *(<(TLength|TTime)[^>]*>)|\| TTime|TTime \|/g,
			''
		).replace(
			/\| TLength/g,
			'| number'
		).replace(
			/TLength \|/g,
			'number |'
		)
	}

	get withoutBrowserComments() {
		return this.replace(
			/(?<=   )\* [-_|][\W\w]+?(?=\*\/)/g,
			''
		)
	}

	get withoutImplicitGlobals() {
		return this.replace(
			/\n?( +\| +)?(?<!type )Globals/g,
			'$1never'
		)
	}

	get withoutNarrowingPatch() {
		return this.replace(
			/\(number & \{\}\)/g,
			'OnlyNumber'
		).replace(
			/\(string & \{\}\)/g,
			'OnlyString'
		)
		.replace(
			/number \| "([^\n]+)" \| OnlyString/g,
			'"$1" | number | OnlyString'
		).replace(
			/((number|OnlyNumber) \| (string|OnlyString)( \| OnlyNumber)?|OnlyString \| OnlyNumber)/g,
			'OnlyStringNumeric'
		).replace(
			/export namespace Property/,
			'export type OnlyObject = Record<never,never>\n\n' +
			'export type OnlyNumber = number & OnlyObject\n\n' +
			'export type OnlyString = string & OnlyObject\n\n' +
			'export type OnlyStringNumeric = (number | string) & OnlyObject\n\n' +
			'export namespace Property'
		)
	}

	get withoutNeverInChain() {
		return this.replace(
			/(never \| | \| never)/g,
			''
		)
	}

	get withoutPropertyValueTyping() {
		return this.replace(
			/export type PropertyValue[\W\w]+?;/,
			''
		)
	}

	get withoutTrailingSpace() {
		return this.replace(
			/\n? +(?=\n)/g,
			''
		).replace(
			/\n{4,}/g,
			'\n\n\n'
		)
	}

	get withoutVendorTyping() {
		return this.replace(
			/\nexport (interface|type) (Obsolete|Vendor)[^\n]+?\{\n[\W\w]+?\n\};?(?=\n)/g, ''
		).replace(
			/\nexport interface (Obsolete|Vendor)[^\n]+?\>\n[\W\w]+?\{\};?(?=\n)/g, ''
		).replace(
			/\nexport interface (Obsolete|Vendor)[^\n]+?{};?(?=\n)/g, ''
		).replace(
			/\n    (Obsolete|Vendor)[^\n]+?,(?=\n)/g, ''
		).replace(
			/\n *\| *":*-[^"]+"/g, ''
		).replace(
			'\n    "-moz-font-feature-settings"?: FontFeatureSettings;', ''
		).replace(
			/\n? *\| *"-[^"]+"/g, ''
		).replace(
			/"-[^"]+" *\| *\n?/g, ''
		).replace(
			/\n? *\| *"-[^\n]+(?=\n)/g, ''
		).replace(
			/\n    MozFontFeatureSettings?: FontFeatureSettings;/, ''
		)
	}
}

generateTypes()
