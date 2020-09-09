/**
 * @jest-environment node
 */
import { createCss } from '../src';
describe('createCss: SSR', () => {
  test('should regenerate styles when server side rendered', () => {
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

    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dzoaVP/*X*/{color:red;}"
    `);
    expect(secondStyles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dzoaVP/*X*/{color:red;}"
    `);
    expect(styles).toEqual(secondStyles);
  });
});
