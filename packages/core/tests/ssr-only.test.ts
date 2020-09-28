/**
 * @jest-environment node
 */
import { createCss } from '../src';

describe('createCss: SSR', () => {
  test('should regenerate global styles on the server', () => {
    const css = createCss(
      {
        breakpoints: {
          bp1: (rule) => `@media (min-width: 480px) { ${rule} }`,
        },
      },
      null
    );

    const global = css.global({
      body: {
        backgroundColor: 'red',
        margin: '0',
      },
      bp1: {
        body: {
          backgroundColor: 'blue',
        },
      },
    });

    // this acts like a request on the server
    const { styles } = css.getStyles(() => {
      global();
    });

    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
       body{background-color:red;}
       body{margin-top:0;}
       body{margin-right:0;}
       body{margin-bottom:0;}
       body{margin-left:0;}"
    `);

    expect(styles[3]).toMatchInlineSnapshot(`
      "/* STITCHES:bp1 */
      @media (min-width: 480px) {  body{background-color:blue;} }"
    `);
  });

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

    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_vfarC/*X*/{color:red;}"
    `);
    expect(secondStyles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_vfarC/*X*/{color:red;}"
    `);
    expect(styles).toEqual(secondStyles);
  });

  test('should regenerate keyframes on the server', () => {
    const css = createCss({}, null);

    const fade = css.keyframes({
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    });
    const atoms = css({ animation: `${fade} 333ms` }) as any;
    // this acts like a request on the server
    const { styles } = css.getStyles(() => {
      atoms.toString();
    });

    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES:__keyframes__ */
      @keyframes dhzmon {0% {opacity: 0;}100% {opacity: 1;}}"
    `);

    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_btwGrK/*X*/{animation-name:dhzmon;}
      ./*X*/_gVejHY/*X*/{animation-duration:333ms;}"
    `);
  });
});
