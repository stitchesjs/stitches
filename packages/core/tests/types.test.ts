import { Config } from 'tsd/dist/lib/interfaces';
import { StitchesCSS, Properties, createCss } from '../src';

/**
 * Type testing utils:
 */

type CleanString<A> = A extends any ? (string extends A ? never : A) : A;
type CleanNumber<A> = A extends any ? (number extends A ? never : A) : A;
type CleanType<M> = Exclude<CleanString<CleanNumber<M>>, undefined>;
type UnionsToMatch<A, B> = Exclude<CleanType<A>, CleanType<B>> | Exclude<CleanType<B>, CleanType<A>>;
type Fun = () => {};
interface InferMatches<A, B> {
  /**
   * A Strict union match that checks that filters out string & number but keeps other values like 'test' & 3 & false etc..
   */
  toShallowMatch: UnionsToMatch<A, B> extends never ? Fun : never;
  toNotShallowMatch: UnionsToMatch<A, B> extends never ? never : Fun;
  toMatch: A extends B ? (B extends A ? Fun : never) : never;
  toNotMatch: A extends B ? (B extends A ? never : Fun) : Fun;
}

// since we're just testing types.
// we are creating a catch all proxy which we will use inside the Expect call
const catchAll = new Proxy(
  {},
  {
    get(target, name) {
      return () => {
        return;
      };
    },
  }
);
export const Expect = <A>(a?: A) => {
  return {
    And: <B>(b?: B): InferMatches<A, B> => {
      return catchAll as any;
    },
  };
};

test('typescript types', () => {
  const config = {
    tokens: {
      colors: {
        $red100: 'tomato',
      },
    },
    breakpoints: {
      bp1: (val: string) => ``,
    },
    utils: {
      mx: (value: string) => {
        return {};
      },
      my: (value: number) => {
        return {};
      },
    },
  } as const;

  const css = createCss(config);

  // css returns a string

  Expect<string>().And(css({})).toMatch();

  /**
   * Asserting Stitches CSS works
   * 1- Testing the following:
   * 2- Normal properties
   * 3- Tokens
   * 4- Breakpoints and nested styles
   * 5- Utils
   *
   */
  const styles: StitchesCSS<typeof config.breakpoints, typeof config.tokens, typeof config.utils> = {};

  /**
   * Normal properties
   */
  Expect<Properties['position']>().And(styles.position).toShallowMatch();

  Expect<Properties['color']>().And(styles.position).toNotShallowMatch();

  /**
   * Tokens:
   */
  Expect<Properties['color'] | keyof typeof config.tokens.colors>().And(styles.color).toShallowMatch();

  Expect<Properties['padding'] | keyof typeof config.tokens.colors>().And(styles.color).toNotShallowMatch();

  /**
   * Breakpoints and nested styles:
   */
  Expect<StitchesCSS<typeof config.breakpoints, typeof config.tokens, typeof config.utils>>()
    .And(styles.bp1)
    .toShallowMatch();
  Expect<string | number | StitchesCSS<typeof config.breakpoints, typeof config.tokens, typeof config.utils>>()
    .And(styles.fwqfqwf)
    .toMatch();

  /**
   * Utils:
   */
  Expect<string>().And(styles.mx).toMatch();
  Expect<number>().And(styles.my).toMatch();

  Expect<string>().And(css(styles)).toMatch();

  /**
   * Making sure that css argument styles are typed correctly
   */
  type CSS = typeof css.global extends (a: infer A) => any ? A : never;
  // make sure that direct properties are not typed as css properties:
  Expect<CSS['color']>().And(styles.color).toNotShallowMatch();

  // make sure that the body has the correct type
  Expect<CSS['body']>()
    .And<StitchesCSS<typeof config.breakpoints, typeof config.tokens, typeof config.utils>>()
    .toMatch();

  // make sure that a nested properties are properly mirroring the type of the type we're getting in the above style object
  Expect<CSS['body']['color']>().And(styles.color).toShallowMatch();
  Expect<CSS['body']['padding']>().And(styles.padding).toShallowMatch();
  Expect<CSS['body']['position']>().And(styles.position).toShallowMatch();
  Expect<CSS['body']['bp1']>().And(styles.bp1).toMatch();
  Expect<CSS['body']['mx']>().And(styles.mx).toMatch();
  Expect<CSS['body']['my']>().And(styles.my).toMatch();

  /**
   * Making sure that global styles are typed correctly
   */
  type GlobalCSS = typeof css.global extends (a: infer B) => any ? B : never;
  // make sure that direct properties are not typed as css properties:
  Expect<GlobalCSS['color']>().And(styles.color).toNotShallowMatch();

  // make sure that the body has the correct type
  Expect<GlobalCSS['body']>()
    .And<StitchesCSS<typeof config.breakpoints, typeof config.tokens, typeof config.utils>>()
    .toMatch();

  // make sure that a nested properties are properly mirroring the type of the type we're getting in the above style object
  Expect<GlobalCSS['body']['color']>().And(styles.color).toShallowMatch();
  Expect<GlobalCSS['body']['padding']>().And(styles.padding).toShallowMatch();
  Expect<GlobalCSS['body']['position']>().And(styles.position).toShallowMatch();
  Expect<GlobalCSS['body']['bp1']>().And(styles.bp1).toMatch();
  Expect<GlobalCSS['body']['mx']>().And(styles.mx).toMatch();
  Expect<GlobalCSS['body']['my']>().And(styles.my).toMatch();

  /**
   * Making sure that keyframes styles are typed correctly
   */
  type KeyframesCSS = typeof css.keyframes extends (a: infer C) => any ? C : never;
  type f = KeyframesCSS['100'];

  // make sure that the body has the correct type
  Expect<KeyframesCSS['from']>()
    .And<StitchesCSS<{}, typeof config.tokens, typeof config.utils, false, false>>()
    .toMatch();

  // make sure that a nested properties are properly mirroring the type of the type we're getting in the above style object
  Expect<KeyframesCSS['from']['color']>().And(styles.color).toShallowMatch();
  Expect<KeyframesCSS['from']['padding']>().And(styles.padding).toShallowMatch();
  Expect<KeyframesCSS['from']['position']>().And(styles.position).toShallowMatch();
  Expect<KeyframesCSS['from']['bp1']>().And(styles.bp1).toNotShallowMatch();
  Expect<KeyframesCSS['from']['mx']>().And(styles.mx).toMatch();
  Expect<KeyframesCSS['from']['my']>().And(styles.my).toMatch();

  /**
   * Strict CSS
   */
  const tokensOne = { colors: { $red100: 'tomato' } };
  const tokensTwo = { space: { $1: '20px' } };
  const strictCSS: StitchesCSS<typeof config.breakpoints, typeof tokensOne, typeof config.utils, true> = {};
  const strictCSSTwo: StitchesCSS<typeof config.breakpoints, typeof tokensTwo, typeof config.utils, true> = {};

  // Color with token scale set
  Expect<keyof typeof config.tokens.colors>().And(strictCSS.color).toShallowMatch();
  // Padding with space scale not set
  Expect<Properties['padding']>().And(strictCSS.padding).toShallowMatch();
  // Padding with space scale set
  Expect<keyof typeof tokensTwo.space>().And(strictCSSTwo.padding).toShallowMatch();
  // Color with color scale not set
  Expect<Properties['color']>().And(strictCSSTwo.color).toShallowMatch();
});
