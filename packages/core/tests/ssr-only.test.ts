/**
 * @jest-environment node
 */
import { createCss, createTokens, hotReloadingCache } from '../src';
describe('createCss: SSR', () => {
  test.only('should regenerate styles when server side rendered', () => {
    const css = createCss({}, null);
    const atoms = css({ color: 'red' }) as any;
    // this acts like a request on the server
    const { styles } = css.getStyles(() => {
      atoms.toString();
    });

    // this acts like another request on the server
    const { styles: secondStyles } = css.getStyles(() => {
      atoms.toString();
    });

    // so below we make sure that both atoms despite being the same
    // are actually generating styles instead of relying on the cache like on
    // the client

    expect(styles).toMatchInlineSnapshot(`
      Array [
        "/* STITCHES:__variables__ */
      :root{--colors-red100:red;}",
        "/* STITCHES */
      ./*X*/_eaTrZx/*X*/{color:var(--colors-red100);}
      ./*X*/_dwsMDu/*X*/{animation-name:ftEIjK;}
      @keyframes ftEIjK {from {background-color: red;}to {background-color: blue;}",
      ]
    `);
    expect(secondStyles).toMatchInlineSnapshot(`
      Array [
        "/* STITCHES:__variables__ */
      :root{--colors-red100:red;}",
        "/* STITCHES */
      ./*X*/_eaTrZx/*X*/{color:var(--colors-red100);}
      ./*X*/_dwsMDu/*X*/{animation-name:ftEIjK;}
      @keyframes ftEIjK {from {background-color: red;}to {background-color: blue;}",
      ]
    `);
    expect(styles).toEqual(secondStyles);
  });
});
