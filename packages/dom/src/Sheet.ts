import { CSSProps, CSSValue } from '@stitches/core/src/types/index';
import isStitchesRule from '@stitches/core/src/utils/isStitchesRule';
import StitchesRule from '@stitches/core/src/Rule';
import StitchesSheet from '@stitches/core/src/Sheet';

type Attributes<T> = { [k in string]: k extends keyof T ? T[k] : any };

interface Elements {
	a: HTMLAnchorElement & { localName: 'a' };
	button: HTMLButtonElement & { localName: 'button' };
	div: HTMLDivElement & { localName: 'div' };
	span: HTMLSpanElement & { localName: 'span' };
}

interface Component<T extends Element = Element> {
	(props: any): Element;

	element: T;
	rule: StitchesRule;
}

const isComponent = (value: Component | unknown): value is Component => isStitchesRule(Object(value).rule);

export const setAttributes = <ELEMENT extends HTMLElement | SVGElement, ATTRIBUTES = Attributes<Element>>(
	element: ELEMENT,
	props: ATTRIBUTES,
) => {
	for (const name in props) {
		if (name in element) element[name as keyof ELEMENT] = (props[name] as unknown) as ELEMENT[keyof ELEMENT];
		else element.setAttribute(name, (props[name] as unknown) as string);
	}
	return element;
};

let iterator = 0;

class StitchesDomSheet extends StitchesSheet {
	constructor() {
		super();

		this.styled = this.styled.bind(this);
	}

	/** Returns a new CSS rule bound to the current sheet. */
	styled<
		VALUE extends CSSValue,
		PROPS extends CSSProps<PROPS, VALUE>,
		COMPONENT extends Component,
		ARG0 extends string | Component,
		ARGN extends PROPS | Component
	>(name: ARG0, ...args: ARGN[]) {
		console.log('styled');
		type NAME = ARG0 extends COMPONENT ? COMPONENT['element']['localName'] : string;
		type ELEMENT = NAME extends keyof Elements ? Elements[NAME] : HTMLUnknownElement;

		const element = (isComponent(name)
			? document.createElement(name.element.localName)
			: document.createElement((name as unknown) as string)) as ELEMENT;
		const rule = new StitchesRule();
		const hash = ++iterator;
		rule.selectors = ['.rule-' + hash];
		this.rules.add(rule);

		if (isComponent(name)) rule.rules.add(name.rule);

		for (const arg of args) {
			if (isStitchesRule(arg)) rule.rules.add(arg);
			else if (isComponent(arg)) rule.rules.add(arg.rule);
			else rule.style = (arg as unknown) as PROPS;
		}

		const Component: Component<ELEMENT> = (props: Attributes<ELEMENT>) => {
			setAttributes(element, props);

			const classNames = rule.renderClassNames();

			if (classNames) element.classList.add(...classNames);

			return element;
		};

		Component.element = element;
		Component.rule = rule;

		return Component;
	}
}

export default StitchesDomSheet;
