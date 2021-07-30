import { toHyphenCase } from './toHyphenCase.js'

/** Returns a declaration sizing value with polyfilled sizing keywords. */
export const toSizingValue = (/** @type {string} */ declarationName, /** @type {string} */ declarationValue) => (
	declarationName in sizeProps && typeof declarationValue === 'string'
		? declarationValue.replace(
			/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,
			(data, lead, main, tail) => (
				lead + (
					main === 'stretch'
						? `-moz-available${tail};${toHyphenCase(declarationName)}:${lead}-webkit-fill-available`
					: `-moz-fit-content${tail};${toHyphenCase(declarationName)}:${lead}fit-content`
				) + tail
			),
		)
	: String(declarationValue)
) // prettier-ignore

/** CSS Properties whose value include a sizing keyword. */
const sizeProps = {
	blockSize: 1,
	height: 1,
	inlineSize: 1,
	maxBlockSize: 1,
	maxHeight: 1,
	maxInlineSize: 1,
	maxWidth: 1,
	minBlockSize: 1,
	minHeight: 1,
	minInlineSize: 1,
	minWidth: 1,
	width: 1,
}
