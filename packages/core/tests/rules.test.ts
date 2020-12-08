// import createCss from '../src/index';

describe('Rules', () => {
	/** @todo fix false positives - there are no tests. */
	describe('Base', () => {
		test('Rule produces CSS', () => {
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Selectors', () => {
		test('Rule produces resolved chaining in CSS', () => {
			/*
			css({
				'&.extra-class': { color: 'red' },
				'&[extra-attribute]': {color: 'red'},
				'&#extra-id': { color: 'red' }
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Pseudo-Selectors', () => {
		test('Rule produces resolved psuedo-selectors in CSS', () => {
			/*
			css({
				'&:hover': { color: 'black' },
				'&::before': { content: 'before' }
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Descendants', () => {
		test('Rule produces resolved descendant selectors in CSS', () => {
			/*
			css({
				'.descendant-class': { color: 'red' },
				'descendant-type': { color: 'red' },
				'[descendant-attr]': { color: 'red' },
				'#descendant-id': { color: 'red' }
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Combinators', () => {
		test('Rule produces resolved combinators in CSS', () => {
			/*
			css({
				'& + .adjacent-class': { color: 'red' },
				'& > .immediate-class': { color: 'red' }
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Reverse Nesting', () => {
		test('Rule produces resolved rules where a nesting selector came later in the selector', () => {
			/*
			const rule = css({
				'button &': { color: 'red' },
				'button &:hover': { color: 'red' },
				'button:hover &': { color: 'red' }
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('At-Rules', () => {
		test('Rule produces resolved inline `@media` at-rules in CSS', () => {
			/*
			css({
				color: 'red',
				'@media (min-width: 480px)': { color: 'blue' },
				'@media print': { fontSize: '16px' }
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Global', () => {
		test('Rule produces global styles', () => {
			expect(true).toBe(true);
		});
		test('Rule produces global @keyframes', () => {
			expect(true).toBe(true);
		});
		test('Rule produces global @font-face', () => {
			expect(true).toBe(true);
		});
		test('Rule produces global @import', () => {
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Component Refrences', () => {
		test('Ability to target other components within components', () => {
			/*
			const componentA = css({ color: 'red' })

			const componentB = css({
				[componentA.selector]: { color: 'blue' }
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Extension', () => {
		test('Ability to extend components', () => {
			/*
			const componentA = css({ color: 'red' })

			const componentB = css(componentA, {
				color: 'blue'
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Numeric Conversion', () => {
		test('Numeric values should be converted into `px` units', () => {
			/*
			const componentA = css({ width: 50 })
			*/
			expect(true).toBe(true);
		});
	});
});
