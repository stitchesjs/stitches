import { parseHTML } from 'linkedom'
import { PerformanceObserver, performance } from 'node:perf_hooks'

const ownKeys = [
	'Attr',
	'CharacterData',
	'Comment',
	'CustomEvent',
	'DOMParser',
	'Document',
	'DocumentFragment',
	'DocumentType',
	'Element',
	'HTMLAnchorElement',
	'HTMLAreaElement',
	'HTMLAudioElement',
	'HTMLBRElement',
	'HTMLBaseElement',
	'HTMLBodyElement',
	'HTMLButtonElement',
	'HTMLCanvasElement',
	'HTMLDListElement',
	'HTMLDataElement',
	'HTMLDataListElement',
	'HTMLDetailsElement',
	'HTMLDirectoryElement',
	'HTMLDivElement',
	'HTMLElement',
	'HTMLEmbedElement',
	'HTMLFieldSetElement',
	'HTMLFontElement',
	'HTMLFormElement',
	'HTMLFrameElement',
	'HTMLFrameSetElement',
	'HTMLHRElement',
	'HTMLHeadElement',
	'HTMLHeadingElement',
	'HTMLHtmlElement',
	'HTMLIFrameElement',
	'HTMLImageElement',
	'HTMLInputElement',
	'HTMLLIElement',
	'HTMLLabelElement',
	'HTMLLegendElement',
	'HTMLLinkElement',
	'HTMLMapElement',
	'HTMLMarqueeElement',
	'HTMLMediaElement',
	'HTMLMenuElement',
	'HTMLMetaElement',
	'HTMLMeterElement',
	'HTMLModElement',
	'HTMLOListElement',
	'HTMLObjectElement',
	'HTMLOptGroupElement',
	'HTMLOptionElement',
	'HTMLOutputElement',
	'HTMLParagraphElement',
	'HTMLParamElement',
	'HTMLPictureElement',
	'HTMLPreElement',
	'HTMLProgressElement',
	'HTMLQuoteElement',
	'HTMLScriptElement',
	'HTMLSelectElement',
	'HTMLSlotElement',
	'HTMLSourceElement',
	'HTMLSpanElement',
	'HTMLStyleElement',
	'HTMLTableCaptionElement',
	'HTMLTableCellElement',
	'HTMLTableElement',
	'HTMLTableRowElement',
	'HTMLTemplateElement',
	'HTMLTextAreaElement',
	'HTMLTimeElement',
	'HTMLTitleElement',
	'HTMLTrackElement',
	'HTMLUListElement',
	'HTMLUnknownElement',
	'HTMLVideoElement',
	'Image',
	'InputEvent',
	'MutationObserver',
	'Node',
	'NodeList',
	'SVGElement',
	'ShadowRoot',
	'Text',
	'customElements',
	'document',
	'navigator',
]

function EventTarget() {
	throw TypeError('Illegal constructor')
}

function Window() {
	throw TypeError('Illegal constructor')
}

Window.prototype = Object.create(EventTarget.prototype, {
	constructor: {
		value: Window,
		configurable: true,
		writable: true,
	},
})

class Screen {
	get availHeight() {
		return 768
	}
	get availLeft() {
		return 0
	}
	get availTop() {
		return 0
	}
	get availWidth() {
		return 1024
	}
	get colorDepth() {
		return 24
	}
	get height() {
		return 768
	}
	get pixelDepth() {
		return 24
	}
	get width() {
		return 1024
	}
}

const parseGlobal = parseHTML('<!doctype html><html><head></head><body></body></html>')

const window = Object.create(Window.prototype)

ownKeys.reduce(
	(window, key) => {
		Reflect.set(window, key, parseGlobal[key])

		return window
	},
	Object.assign(window, globalThis, {
		PerformanceObserver,
		Screen,
		Window,
		alert(message) {
			void String(message)
		},
		atob(data) {
			return Buffer.from(data, 'base64').toString('binary')
		},
		btoa(data) {
			return Buffer.from(b).toString('base64')
		},
		performance,
		screen: new Screen(),
		screenLeft: 0,
		screenTop: 0,
		screenX: 0,
		screenY: 0,
		scrollX: 0,
		scrollY: 0,
		status: '',
		window: window,
	}),
)
