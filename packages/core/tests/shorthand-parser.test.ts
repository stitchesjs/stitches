import {
  animation,
  background,
  border,
  borderColor,
  borderStyle,
  borderWidth,
  borderBottom,
  borderLeft,
  borderTop,
  borderRight,
  boxShadow,
  font,
  margin,
  padding,
  transition,
} from '../src/shorthand-parser';

const tokens = {
  sizes: { 1: '1px' },
  colors: {
    gray400: '#e3e3e3',
  },
  space: { 1: '5px', 2: '10px', 3: '15px', 4: '20px' },
  fontSizes: { 1: '18px' },
  lineHeights: { 1: '2' },
  fontWeights: { 1: '500' },
  fonts: { main: 'potato-font' },
  borderWidths: { hairLine: '1px' },
  radii: { 1: '3px' },
  transitions: { slow: 'all 1000ms', multiGroup: 'margin-right 2s, color 1s' },
};

// works
describe('Background shorthand', () => {
  test('Handles backgroundColor', () => {
    expect(background(tokens, 'red')).toMatchInlineSnapshot(`
      Object {
        "backgroundColor": "red",
      }
    `);
  });

  // works
  test('Handles backgroundColor with token', () => {
    expect(background(tokens, 'gray400')).toMatchInlineSnapshot(`
      Object {
        "backgroundColor": "#e3e3e3",
      }
    `);
  });

  // works
  test('Handles url', () => {
    expect(background(tokens, 'url("../../media/examples/lizard.png")')).toMatchInlineSnapshot(`
      Object {
        "backgroundImage": "url(\\"../../media/examples/lizard.png\\")",
      }
    `);
  });

  // fails
  // test("Handles radial-gradient", () => {
  //   expect(background(tokens, "radial-gradient(crimson, skyblue)"))
  //     .toMatchInlineSnapshot(`
  //     Object {
  //       "backgroundColor": "radial-gradient(crimson, skyblue)",
  //     }
  //   `);
  // });

  test('Handles gradient with nesting', () => {
    expect(background(tokens, 'linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5))')).toMatchInlineSnapshot(`
      Object {
        "backgroundImage": "linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5))",
      }
    `);
  });

  test('Handles complex combinations', () => {
    // works
    expect(background(tokens, 'lightblue url("img_tree.gif") no-repeat fixed center')).toMatchInlineSnapshot(`
      Object {
        "backgroundAttachment": "fixed",
        "backgroundColor": "lightblue",
        "backgroundImage": "url(\\"img_tree.gif\\")",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
      }
    `);
    // works
    expect(background(tokens, 'no-repeat url("../lizard.png"), repeat-x url("../examples/dog.png")'))
      .toMatchInlineSnapshot(`
      Object {
        "backgroundImage": "url(\\"../lizard.png\\"),url(\\"../examples/dog.png\\")",
        "backgroundRepeat": "no-repeat,repeat-x",
      }
    `);

    // expect(
    //   background(
    //     tokens,
    //     'left 5% / 15% 60% repeat-x url("../../media/examples/star.png")'
    //   )
    // ).toMatchInlineSnapshot(`
    //   Object {
    //     "backgroundImage": "url(\\"../../media/examples/star.png\\")",
    //     "backgroundPosition": "left,5%,60%",
    //     "backgroundRepeat": "repeat-x",
    //     "backgroundSize": "15%",
    //   }
    // `);

    expect(
      background(
        tokens,
        'center / contain no-repeat url("../../media/examples/firefox-logo.svg"), #eee 35% url("../../media/examples/lizard.png")'
      )
    ).toMatchInlineSnapshot(`
      Object {
        "backgroundColor": "#eee",
        "backgroundImage": "url(\\"../../media/examples/firefox-logo.svg\\"),url(\\"../../media/examples/lizard.png\\")",
        "backgroundPosition": "center,35%",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "contain",
      }
    `);
  });
});

describe('Font shorthand', () => {
  test('Font shorthands without tokens', () => {
    expect(font(tokens, '1.2em "Fira Sans", sans-serif')).toMatchInlineSnapshot(`
      Object {
        "fontFamily": "\\"Fira Sans\\",sans-serif",
        "fontSize": "1.2em",
      }
    `);

    expect(font(tokens, 'italic bold 12px/30px Georgia, serif')).toMatchInlineSnapshot(`
      Object {
        "fontFamily": "Georgia,serif",
        "fontSize": "12px",
        "fontStyle": "italic",
        "fontWeight": "bold",
        "lineHeight": "30px",
      }
    `);

    // match
    expect(font(tokens, 'italic 1.2em "Fira Sans", serif')).toMatchInlineSnapshot(`
          Object {
            "fontFamily": "\\"Fira Sans\\",serif",
            "fontSize": "1.2em",
            "fontStyle": "italic",
          }
      `);
    // match
    expect(font(tokens, 'italic bold 16px/2 cursive')).toMatchInlineSnapshot(`
      Object {
        "fontFamily": "cursive",
        "fontSize": "16px",
        "fontStyle": "italic",
        "fontWeight": "bold",
        "lineHeight": "2",
      }
    `);
    // match:
    expect(font(tokens, 'bold 24px/1 sans-serif')).toMatchInlineSnapshot(`
      Object {
        "fontFamily": "sans-serif",
        "fontSize": "24px",
        "fontWeight": "bold",
        "lineHeight": "2",
      }
    `);
    // match:
    expect(font(tokens, 'caption')).toMatchInlineSnapshot(`
          Object {
            "fontFamily": "caption",
          }
      `);
  });

  // Fail: font variant not handled.
  // test("Handles font-variant", () => {
  //   expect(font(tokens, "small-caps bold 24px/1 sans-serif"))
  //     .toMatchInlineSnapshot(`
  //     Object {
  //       "fontFamily": "sans-serif",
  //       "fontSize": "24px",
  //       "fontWeight": 700,
  //       "lineHeight": "2",
  //     }
  //   `);
  // });

  // works:
  test('Handles fontSize token', () => {
    expect(font(tokens, 'bold 1/3 arial')).toMatchInlineSnapshot(`
      Object {
        "fontFamily": "arial",
        "fontSize": "18px",
        "fontWeight": "bold",
        "lineHeight": "3",
      }
    `);
  });
  // match:
  test('Handles lineHeight token', () => {
    expect(font(tokens, 'bold 13px/1 arial')).toMatchInlineSnapshot(`
      Object {
        "fontFamily": "arial",
        "fontSize": "13px",
        "fontWeight": "bold",
        "lineHeight": "2",
      }
    `);
  });
  // match
  test('Handles font-family token', () => {
    expect(font(tokens, 'bold 13px/3 main')).toMatchInlineSnapshot(`
      Object {
        "fontFamily": "potato-font",
        "fontSize": "13px",
        "fontWeight": "bold",
        "lineHeight": "3",
      }
    `);
  });

  // Fail:
  // test("Handles font-weight token", () => {
  //   expect(font(tokens, "1 13px/3 arial")).toMatchInlineSnapshot(`
  //     Object {
  //       "fontFamily": "potato-font",
  //       "fontSize": "13px",
  //       "lineHeight": "2",
  //     }
  //   `);
  // });
});
// works
describe('Animation shorthand', () => {
  test('Handles animation shorthand', () => {
    // works
    expect(animation(tokens, '3s ease-in 1s infinite reverse both running slidein')).toMatchInlineSnapshot(`
      Object {
        "animationDelay": "1s",
        "animationDirection": "reverse",
        "animationDuration": "3s",
        "animationFillMode": "both",
        "animationIterationCount": "infinite",
        "animationName": "slidein",
        "animationPlayState": "running",
        "animationTimingFunction": "ease-in",
      }
    `);
    // works:
    expect(animation(tokens, '3s linear 1s infinite running slidein')).toMatchInlineSnapshot(`
      Object {
        "animationDelay": "1s",
        "animationDuration": "3s",
        "animationIterationCount": "infinite",
        "animationName": "slidein",
        "animationPlayState": "running",
        "animationTimingFunction": "linear",
      }
    `);

    // Works:
    expect(animation(tokens, 'slidein 3s')).toMatchInlineSnapshot(`
      Object {
        "animationDuration": "3s",
        "animationName": "slidein",
      }
    `);
  });
  test('Handles multiple animation groups', () => {
    // works:
    expect(animation(tokens, '3s linear 1s infinite running slidein, 2s 1s 2 ease-in hello')).toMatchInlineSnapshot(`
      Object {
        "animationDelay": "1s,1s",
        "animationDuration": "3s,2s",
        "animationIterationCount": "infinite,2",
        "animationName": "slidein,hello",
        "animationPlayState": "running",
        "animationTimingFunction": "linear,ease-in",
      }
    `);

    // works:
    expect(animation(tokens, '3s running slidein, 2s ease-in hello')).toMatchInlineSnapshot(`
      Object {
        "animationDuration": "3s,2s",
        "animationName": "slidein,hello",
        "animationPlayState": "running",
        "animationTimingFunction": "ease-in",
      }
    `);
  });
  test('Handles multiple animation groups that rely on defaults', () => {
    // fails:
    // most defaults are not handled
    // expect(
    //   animation(tokens, "3s linear 1s infinite running slidein, 2s ease-in")
    // ).toMatchInlineSnapshot(`
    //   Object {
    //     "animationDelay": "1s",
    //     "animationDuration": "3s,2s",
    //     "animationIterationCount": "infinite",
    //     "animationName": "slidein",
    //     "animationPlayState": "running",
    //     "animationTimingFunction": "linear,ease-in",
    //   }
    // `);
  });
});

describe('Transition shorthand', () => {
  test('Handles transition shorthand', () => {
    // works
    expect(transition(tokens, 'margin-right 2s')).toMatchInlineSnapshot(`
      Object {
        "transitionDuration": "2s",
        "transitionProperty": "margin-right",
      }
    `);

    expect(transition(tokens, 'margin-right 2s .5s')).toMatchInlineSnapshot(`
          Object {
            "transitionDelay": ".5s",
            "transitionDuration": "2s",
            "transitionProperty": "margin-right",
          }
      `);

    expect(transition(tokens, 'margin-right 2s ease-in-out')).toMatchInlineSnapshot(`
          Object {
            "transitionDuration": "2s",
            "transitionProperty": "margin-right",
            "transitionTimingFunction": "ease-in-out",
          }
      `);

    expect(transition(tokens, 'margin-right 2s ease-in-out .5s')).toMatchInlineSnapshot(`
          Object {
            "transitionDelay": ".5s",
            "transitionDuration": "2s",
            "transitionProperty": "margin-right",
            "transitionTimingFunction": "ease-in-out",
          }
      `);

    expect(transition(tokens, 'all 1s ease-out')).toMatchInlineSnapshot(`
          Object {
            "transitionDuration": "1s",
            "transitionProperty": "all",
            "transitionTimingFunction": "ease-out",
          }
      `);
    expect(transition(tokens, 'slow')).toMatchInlineSnapshot(`
          Object {
            "transitionDuration": "1000ms",
            "transitionProperty": "all",
          }
      `);
  });
  test('Handles multi-group transition shorthand', () => {
    // works
    expect(transition(tokens, 'margin-right 2s, color 1s')).toMatchInlineSnapshot(`
      Object {
        "transitionDuration": "2s,1s",
        "transitionProperty": "margin-right,color",
      }
    `);
    expect(transition(tokens, 'multiGroup')).toMatchInlineSnapshot(`
      Object {
        "transitionDuration": "2s,1s",
        "transitionProperty": "margin-right,color",
      }
    `);
  });

  test('Handles multi-group transition shorthand with defaults', () => {
    // Fails:
    // expect(transition(tokens, "margin-right 2s ease-in-out, color 1s"))
    //   .toMatchInlineSnapshot(`
    //   Object {
    //     "transitionDuration": "2s,1s",
    //     "transitionProperty": "margin-right,color",
    //     "transitionTimingFunction": "ease-in-out",
    //   }
    // `);
  });
});

describe('Margin shorthand', () => {
  test('Handles margin shorthand', () => {
    // works
    expect(margin(tokens, '1em')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "1em",
        "marginLeft": "1em",
        "marginRight": "1em",
        "marginTop": "1em",
      }
    `);

    expect(margin(tokens, '5% 0')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "5%",
        "marginLeft": "0",
        "marginRight": "0",
        "marginTop": "5%",
      }
    `);

    expect(margin(tokens, '10px 50px 20px')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "20px",
        "marginLeft": "50px",
        "marginRight": "50px",
        "marginTop": "10px",
      }
    `);

    expect(margin(tokens, '10px 50px 20px 0')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "20px",
        "marginLeft": "0",
        "marginRight": "50px",
        "marginTop": "10px",
      }
    `);

    expect(margin(tokens, '0')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "0",
        "marginLeft": "0",
        "marginRight": "0",
        "marginTop": "0",
      }
    `);
  });
  test('Handles margin with tokens', () => {
    // works
    expect(margin(tokens, '1')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "5px",
        "marginLeft": "5px",
        "marginRight": "5px",
        "marginTop": "5px",
      }
    `);
    expect(margin(tokens, '1 1')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "5px",
        "marginLeft": "5px",
        "marginRight": "5px",
        "marginTop": "5px",
      }
    `);
    expect(margin(tokens, '1 1 1')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "5px",
        "marginLeft": "5px",
        "marginRight": "5px",
        "marginTop": "5px",
      }
    `);
    expect(margin(tokens, '1 1 1 1')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "5px",
        "marginLeft": "5px",
        "marginRight": "5px",
        "marginTop": "5px",
      }
    `);
  });

  test('Handles margin with css functions', () => {
    expect(margin(tokens, 'calc(10px + 100px)')).toMatchInlineSnapshot(`
      Object {
        "marginBottom": "calc(10px + 100px)",
        "marginLeft": "calc(10px + 100px)",
        "marginRight": "calc(10px + 100px)",
        "marginTop": "calc(10px + 100px)",
      }
    `);
  });
});

describe('Padding shorthand', () => {
  test('Handles padding shorthand', () => {
    // works
    expect(padding(tokens, '1em')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "1em",
        "paddingLeft": "1em",
        "paddingRight": "1em",
        "paddingTop": "1em",
      }
    `);

    expect(padding(tokens, '5% 0')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "5%",
        "paddingLeft": "0",
        "paddingRight": "0",
        "paddingTop": "5%",
      }
    `);

    expect(padding(tokens, '10px 50px 20px')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "20px",
        "paddingLeft": "50px",
        "paddingRight": "50px",
        "paddingTop": "10px",
      }
    `);

    expect(padding(tokens, '10px 50px 20px 0')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "20px",
        "paddingLeft": "0",
        "paddingRight": "50px",
        "paddingTop": "10px",
      }
    `);

    expect(padding(tokens, '0')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "0",
        "paddingLeft": "0",
        "paddingRight": "0",
        "paddingTop": "0",
      }
    `);
  });
  test('Handles padding with tokens', () => {
    expect(padding(tokens, '1')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "5px",
        "paddingLeft": "5px",
        "paddingRight": "5px",
        "paddingTop": "5px",
      }
    `);
    expect(padding(tokens, '1 2')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "5px",
        "paddingLeft": "10px",
        "paddingRight": "10px",
        "paddingTop": "5px",
      }
    `);
    expect(padding(tokens, '1 2 3')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "15px",
        "paddingLeft": "10px",
        "paddingRight": "10px",
        "paddingTop": "5px",
      }
    `);
    expect(padding(tokens, '1 2 3 4')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "15px",
        "paddingLeft": "20px",
        "paddingRight": "10px",
        "paddingTop": "5px",
      }
    `);
  });

  test('Handles padding with css functions', () => {
    expect(padding(tokens, 'calc(10px + 100px)')).toMatchInlineSnapshot(`
      Object {
        "paddingBottom": "calc(10px + 100px)",
        "paddingLeft": "calc(10px + 100px)",
        "paddingRight": "calc(10px + 100px)",
        "paddingTop": "calc(10px + 100px)",
      }
    `);
  });
});

describe('Border shorthands', () => {
  test('Handles border shorthand', () => {
    expect(border(tokens, 'none')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "none",
        "borderLeftStyle": "none",
        "borderRightStyle": "none",
        "borderTopStyle": "none",
      }
    `);
    expect(border(tokens, '0')).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": "0",
        "borderLeftWidth": "0",
        "borderRightWidth": "0",
        "borderTopWidth": "0",
      }
    `);
    expect(border(tokens, 'solid')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "solid",
        "borderLeftStyle": "solid",
        "borderRightStyle": "solid",
        "borderTopStyle": "solid",
      }
    `);
    expect(border(tokens, 'dashed red')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "red",
        "borderBottomStyle": "dashed",
        "borderLeftColor": "red",
        "borderLeftStyle": "dashed",
        "borderRightColor": "red",
        "borderRightStyle": "dashed",
        "borderTopColor": "red",
        "borderTopStyle": "dashed",
      }
    `);
    expect(border(tokens, '1rem solid')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "solid",
        "borderBottomWidth": "1rem",
        "borderLeftStyle": "solid",
        "borderLeftWidth": "1rem",
        "borderRightStyle": "solid",
        "borderRightWidth": "1rem",
        "borderTopStyle": "solid",
        "borderTopWidth": "1rem",
      }
    `);

    // Fail: string based width (thick)
    // expect(border(tokens, "thick double #32a1ce")).toMatchInlineSnapshot(`
    //   Object {
    //     "borderBottomColor": "#32a1ce",
    //     "borderBottomStyle": "double",
    //     "borderLeftColor": "#32a1ce",
    //     "borderLeftStyle": "double",
    //     "borderRightColor": "#32a1ce",
    //     "borderRightStyle": "double",
    //     "borderTopColor": "#32a1ce",
    //     "borderTopStyle": "double",
    //   }
    // `);

    expect(border(tokens, '4mm ridge rgba(170, 50, 220, .6)')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "rgba(170, 50, 220, .6)",
        "borderBottomStyle": "ridge",
        "borderBottomWidth": "4mm",
        "borderLeftColor": "rgba(170, 50, 220, .6)",
        "borderLeftStyle": "ridge",
        "borderLeftWidth": "4mm",
        "borderRightColor": "rgba(170, 50, 220, .6)",
        "borderRightStyle": "ridge",
        "borderRightWidth": "4mm",
        "borderTopColor": "rgba(170, 50, 220, .6)",
        "borderTopStyle": "ridge",
        "borderTopWidth": "4mm",
      }
    `);
  });

  test('Handles border-color', () => {
    expect(borderColor(tokens, 'red')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "red",
        "borderLeftColor": "red",
        "borderRightColor": "red",
        "borderTopColor": "red",
      }
    `);

    expect(borderColor(tokens, 'red #32a1ce')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "red",
        "borderLeftColor": "#32a1ce",
        "borderRightColor": "#32a1ce",
        "borderTopColor": "red",
      }
    `);

    expect(borderColor(tokens, 'red rgba(170, 50, 220, .6) green')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "green",
        "borderLeftColor": "rgba(170, 50, 220, .6)",
        "borderRightColor": "rgba(170, 50, 220, .6)",
        "borderTopColor": "red",
      }
    `);

    expect(borderColor(tokens, 'red yellow green hsla(60, 90%, 50%, .8)')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "green",
        "borderLeftColor": "hsla(60, 90%, 50%, .8)",
        "borderRightColor": "yellow",
        "borderTopColor": "red",
      }
    `);

    expect(borderColor(tokens, 'red yellow green transparent')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "green",
        "borderLeftColor": "transparent",
        "borderRightColor": "yellow",
        "borderTopColor": "red",
      }
    `);
  });

  test('Handles border-width', () => {
    expect(borderWidth(tokens, 'thick')).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": "thick",
        "borderLeftWidth": "thick",
        "borderRightWidth": "thick",
        "borderTopWidth": "thick",
      }
    `);

    expect(borderWidth(tokens, '1em')).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": "1em",
        "borderLeftWidth": "1em",
        "borderRightWidth": "1em",
        "borderTopWidth": "1em",
      }
    `);

    expect(borderWidth(tokens, '3px 1.25em')).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": "3px",
        "borderLeftWidth": "1.25em",
        "borderRightWidth": "1.25em",
        "borderTopWidth": "3px",
      }
    `);

    expect(borderWidth(tokens, '2ex 1.25ex 0.5ex')).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": "0.5ex",
        "borderLeftWidth": "1.25ex",
        "borderRightWidth": "1.25ex",
        "borderTopWidth": "2ex",
      }
    `);

    expect(borderWidth(tokens, '0 4px 8px 12px')).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": "8px",
        "borderLeftWidth": "12px",
        "borderRightWidth": "4px",
        "borderTopWidth": "0",
      }
    `);
  });

  test('Handles border-style', () => {
    expect(borderStyle(tokens, 'none')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "none",
        "borderLeftStyle": "none",
        "borderRightStyle": "none",
        "borderTopStyle": "none",
      }
    `);

    expect(borderStyle(tokens, 'dotted')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "dotted",
        "borderLeftStyle": "dotted",
        "borderRightStyle": "dotted",
        "borderTopStyle": "dotted",
      }
    `);

    expect(borderStyle(tokens, 'inset')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "inset",
        "borderLeftStyle": "inset",
        "borderRightStyle": "inset",
        "borderTopStyle": "inset",
      }
    `);

    expect(borderStyle(tokens, 'dashed solid')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "dashed",
        "borderLeftStyle": "solid",
        "borderRightStyle": "solid",
        "borderTopStyle": "dashed",
      }
    `);

    expect(borderStyle(tokens, 'dashed double none')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "none",
        "borderLeftStyle": "double",
        "borderRightStyle": "double",
        "borderTopStyle": "dashed",
      }
    `);

    expect(borderStyle(tokens, 'dashed groove none dotted')).toMatchInlineSnapshot(`
      Object {
        "borderBottomStyle": "none",
        "borderLeftStyle": "dotted",
        "borderRightStyle": "groove",
        "borderTopStyle": "dashed",
      }
    `);
  });
  test('Handles 0 values for border', () => {
    expect(borderTop(tokens, 0)).toMatchInlineSnapshot(`
      Object {
        "borderTopWidth": 0,
      }
    `);
    expect(borderRight(tokens, 0)).toMatchInlineSnapshot(`
      Object {
        "borderRightWidth": 0,
      }
    `);
    expect(borderBottom(tokens, 0)).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": 0,
      }
    `);
    expect(borderLeft(tokens, 0)).toMatchInlineSnapshot(`
      Object {
        "borderLeftWidth": 0,
      }
    `);
  });
  test('Handles border shorthands with tokens', () => {
    expect(border(tokens, 'hairLine gray400 solid')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "#e3e3e3",
        "borderBottomStyle": "solid",
        "borderBottomWidth": "1px",
        "borderLeftColor": "#e3e3e3",
        "borderLeftStyle": "solid",
        "borderLeftWidth": "1px",
        "borderRightColor": "#e3e3e3",
        "borderRightStyle": "solid",
        "borderRightWidth": "1px",
        "borderTopColor": "#e3e3e3",
        "borderTopStyle": "solid",
        "borderTopWidth": "1px",
      }
    `);
    expect(borderWidth(tokens, 'hairLine')).toMatchInlineSnapshot(`
      Object {
        "borderBottomWidth": "1px",
        "borderLeftWidth": "1px",
        "borderRightWidth": "1px",
        "borderTopWidth": "1px",
      }
    `);
    expect(borderColor(tokens, 'gray400')).toMatchInlineSnapshot(`
      Object {
        "borderBottomColor": "#e3e3e3",
        "borderLeftColor": "#e3e3e3",
        "borderRightColor": "#e3e3e3",
        "borderTopColor": "#e3e3e3",
      }
    `);
  });
});

describe('Box-shadow', () => {
  test('Handles tokens in box-shadow', () => {
    expect(boxShadow(tokens, '10px 5px 1px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "10px 5px 1px #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, '1px -16px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "1px -16px #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, '1px 12px 2px 1px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "1px 12px 2px 1px #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, 'inset 1px 1em gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "inset 1px 1em #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, '60px -16px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "60px -16px #e3e3e3",
      }
    `);
  });

  test('Handles tokens in multi-group box-shadow', () => {
    expect(boxShadow(tokens, '10px 5px 1px gray400, 10px 5px 1px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "10px 5px 1px #e3e3e3, 10px 5px 1px #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, '1px -16px gray400, 1px -16px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "1px -16px #e3e3e3, 1px -16px #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, '1px 12px 2px 1px gray400, 1px 12px 2px 1px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "1px 12px 2px 1px #e3e3e3, 1px 12px 2px 1px #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, 'inset 1px 1em gray400, inset 1px 1em gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "inset 1px 1em #e3e3e3, inset 1px 1em #e3e3e3",
      }
    `);
    expect(boxShadow(tokens, '60px -16px gray400, 60px -16px gray400')).toMatchInlineSnapshot(`
      Object {
        "boxShadow": "60px -16px #e3e3e3, 60px -16px #e3e3e3",
      }
    `);
  });
});
