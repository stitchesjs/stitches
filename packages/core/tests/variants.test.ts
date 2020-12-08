// import createCss from '../src/index';

describe('Variants', () => {
	/** @todo fix false positives - there are no tests. */
	describe('Add variants', () => {
		test('Adds a variant', () => {
			/*
			variants: {
				[variantName]: {
					[variantValue]: CSS_OBJECT
				}
			}
			*/
			/*
			const text = css({
				fontFamily: 'system-ui',

				variants: {
					size: {
						small: {
							fontSize: '12px'
						},
						medium: {
							fontSize: '16px'
						},
						large: {
							fontSize: '24px'
						}
					}
				}
			})
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Default variant', () => {
		test('Sets a default variant', () => {
			/*
			const text = css({
				fontFamily: 'system-ui',

				variants: {
					size: {
						small: {
							fontSize: '12px'
						},
						medium: {
							fontSize: '16px'
						},
						large: {
							fontSize: '24px'
						}
					}
				}
			})

			text.defaultVariants = {
				size: 'medium'
			}
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Apply variants', () => {
		test('Applies variants', () => {
			/*
			const text = css({
				fontFamily: 'system-ui',

				variants: {
					size: {
						small: {
							fontSize: '12px'
						},
						medium: {
							fontSize: '16px'
						},
						large: {
							fontSize: '24px'
						}
					}
				}
			})


			() => <div
				<h1 className={text({size: 'large'})}>Hello world</h1>
			</div>
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Responsive variants', () => {
		test('Supports responsive variants', () => {
			/*
			const css = createCss({
				conditions: {
					smallOnly: '@media (max-width: 768px)',
					mediumUp: '@media (min-width: 768px)'
				}
			})

			const text = css({
				fontFamily: 'system-ui',

				variants: {
					size: {
						small: { fontSize: '12px' },
						medium: { fontSize: '16px' },
						large: { fontSize: '24px' }
					}
				}
			})


			() => <div
				<h1 className={text({
					size: {
						// apply the `small` variant initially
						initial: 'small',

						// apply `large` variant from `mediumUp`
						mediumUp: 'large',

						// apply a `medium` variant based on an inline media query
						'@media (min-width: 1024px)': 'medium'
					}
				})}>
				Hello world</h1>
			</div>
			*/
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Compound variants', () => {
		test('Supports compound variants', () => {
			expect(true).toBe(true);
		});
	});

	/** @todo fix false positives - there are no tests. */
	describe('Numeric variants', () => {
		test('Supports numeric variants', () => {
			expect(true).toBe(true);
		});
	});
});
