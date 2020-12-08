import { CSSScale, CSSTheme, CSSToken } from '@stitches/core/src/types/index';
import StitchesDomSheet from './Sheet';

function createCss<Token extends CSSToken, Scale extends CSSScale<Token>, Theme extends CSSTheme<Scale>>(
	opts:
		| never
		| {}
		| {
				theme: Theme;
		  },
) {
	const sheet = new StitchesDomSheet();
	sheet.theme = Object(Object(opts).theme);

	return sheet;
}

export default createCss;
