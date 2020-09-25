import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { createStyled, _ATOM } from '../src';

/**
 * resolves nested rules for media queries into CSSStyleRules
 */
const resolveRules = (rule: CSSRule, resolvedRules: CSSStyleRule[] = []) => {
  if (rule instanceof CSSStyleRule) {
    resolvedRules.push(rule);
  }

  if (rule instanceof CSSMediaRule) {
    for (let i = 0; i < rule.cssRules.length; i++) {
      resolveRules(rule.cssRules[i], resolvedRules);
    }
  }
  return resolvedRules;
};

/**
 * TODO: improve looping
 */
const getMatchingRulesForClasses = (classesAsArray: string[]) => {
  const orderedAppliedStyles: string[] = [];
  for (let i = 0; i < window.document.styleSheets.length; i++) {
    const sheetRules = window.document.styleSheets[i].cssRules as any;
    for (let b = 0; b < sheetRules.length; b++) {
      const rule = sheetRules[b];
      const resolvedRules = resolveRules(rule);
      resolvedRules.forEach((cssRule) => {
        classesAsArray.forEach((atomClass: any) => {
          if (cssRule.selectorText.includes(atomClass)) {
            orderedAppliedStyles.push(cssRule.cssText);
          }
        });
      });
    }
  }
  return orderedAppliedStyles;
};

let { styled, css } = createStyled({});
const resolveVal = (val: any) => {
  const { className, ...props } = val.props;

  // inject styles by calling to string on the atom
  const injectedClasses = className.toString();
  const classesAsArray = injectedClasses.split(' ').map((atomClass: any) => `.${atomClass}`);
  const orderedAppliedStyles = getMatchingRulesForClasses(classesAsArray);

  return {
    orderedAppliedStyles,
    props: { ...props, className: injectedClasses },
    children: val.children,
  };
};

expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    return JSON.stringify(resolveVal(val), null, 2);
  },

  test(val) {
    return val && val.props && val.props.className && val.children && val.type;
  },
});

beforeEach(() => {
  const newStyled = createStyled({});
  styled = newStyled.styled;
  css = newStyled.css;
});

afterEach(() => {
  (css as any).dispose();
});

describe('styled', () => {
  test('Renders basic component', () => {
    const H1 = styled('h1', {
      div: {
        fontSize: 18,
      },
    });

    const tree = renderer.create(<H1 className="hi">hello world</H1>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('renders component with variant', () => {
    const Button = styled('button', {
      backgroundColor: 'gray',
      variants: {
        variant: {
          red: { backgroundColor: 'red' },
          blue: { backgroundColor: 'blue' },
        },
      },
    });

    expect(renderer.create(<Button>hello world</Button>).toJSON()).toMatchSnapshot();
    expect(renderer.create(<Button variant="red">hello world</Button>).toJSON()).toMatchSnapshot();
    expect(renderer.create(<Button variant="blue">hello world</Button>).toJSON()).toMatchSnapshot();
  });

  test('Handles css prop', () => {
    const Button = styled('button', {
      backgroundColor: 'gray',
    });

    expect(renderer.create(<Button css={{ color: 'red' }}>hello world</Button>).toJSON()).toMatchSnapshot();
  });

  test('Handles css prop', () => {
    const Button = styled('button', {
      backgroundColor: 'gray',
    });

    expect(renderer.create(<Button css={{ color: 'red' }}>hello world</Button>).toJSON()).toMatchSnapshot();
  });

  test('Handles compound variant', () => {
    const Button = styled('button', {
      backgroundColor: 'gray',
      variants: {
        variant: {
          red: {
            backgroundColor: 'red',
          },
        },
        size: {
          1: {
            height: 30,
          },
          2: {
            height: 60,
          },
        },
      },
    }).compoundVariant(
      {
        variant: 'red',
        size: 1,
      },
      {
        backgroundColor: 'compoundColor',
      }
    );

    expect(
      renderer
        .create(
          <Button variant="red" size={2}>
            not compound
          </Button>
        )
        .toJSON()
    ).toMatchSnapshot();
    expect(
      renderer
        .create(
          <Button variant="red" size={1}>
            compound
          </Button>
        )
        .toJSON()
    ).toMatchSnapshot();
  });
  test('It has default displayName when a string based element is passed', () => {
    const Button = styled('button', {});
    expect(Button.displayName).toBe('styled(button)');
  });
  test('It defaults to styled(component) when styling a react component that has no displayName', () => {
    const Component = () => <div></div>;
    const Button = styled(Component, {});
    expect(Button.displayName).toBe('styled(Component)');
  });
  test("It defaults to a displayName that uses the internal styled component's displayName if it has one", () => {
    const Component = () => <div></div>;
    Component.displayName = 'MyFancyComponent';
    const Button = styled(Component, {});
    expect(Button.displayName).toBe(`styled(${Component.displayName})`);
  });

  test('Breakpoints work in variants', () => {
    const { styled: _styled, css: _css } = createStyled({
      showFriendlyClassnames: true,
      breakpoints: {
        breakpointOne: (rule) => `@media(min-width:400px){${rule}}`,
        breakpointTwo: (rule) => `@media(min-width:800px){${rule}}`,
      },
    });
    const Button = _styled('button', {
      color: 'red',
      breakpointOne: {
        height: '10px',
      },
      breakpointTwo: {
        height: '20px',
      },
      variants: {
        size: {
          big: {
            breakpointOne: {
              height: '100px',
            },
          },
        },
      },
    });
    expect(renderer.create(<Button>no variant</Button>).toJSON()).toMatchSnapshot();
    (_css as any).dispose();
  });

  test('Breakpoints work in variants and when the variant is passed to the jsx element', () => {
    const { styled: _styled, css: _css } = createStyled({
      showFriendlyClassnames: true,
      breakpoints: {
        breakpointOne: (rule) => `@media(min-width:400px){${rule}}`,
        breakpointTwo: (rule) => `@media(min-width:800px){${rule}}`,
      },
    });
    const Button = _styled('button', {
      color: 'red',
      breakpointOne: {
        height: '10px',
      },
      breakpointTwo: {
        height: '20px',
      },
      variants: {
        size: {
          small: {
            breakpointOne: {
              height: '100px',
            },
            breakpointTwo: {
              height: '200px',
            },
          },
          big: {
            breakpointOne: {
              height: '1000px',
            },
            breakpointTwo: {
              height: '2000px',
            },
          },
        },
      },
    });
    expect(renderer.create(<Button size="big">with variant</Button>).toJSON()).toMatchSnapshot();
    (_css as any).dispose();
  });

  test('Breakpoints work in variants and when a responsive variant is passed ot the element', () => {
    const { styled: _styled, css: _css } = createStyled({
      showFriendlyClassnames: true,
      breakpoints: {
        breakpointOne: (rule) => `@media(min-width:400px){${rule}}`,
        breakpointTwo: (rule) => `@media(min-width:800px){${rule}}`,
      },
    });
    const Button = _styled('button', {
      color: 'red',
      breakpointOne: {
        height: '10px',
      },
      breakpointTwo: {
        height: '20px',
      },
      variants: {
        size: {
          small: {
            breakpointOne: {
              height: '100px',
            },
            breakpointTwo: {
              height: '200px',
            },
          },
          big: {
            breakpointOne: {
              height: '1000px',
            },
            breakpointTwo: {
              height: '2000px',
            },
          },
        },
      },
    });
    expect(
      renderer.create(<Button size={{ breakpointOne: 'small' }}>with responsive variant</Button>).toJSON()
    ).toMatchSnapshot();
    (_css as any).dispose();
  });
  test('It creates a string className', () => {
    const Component = ({ className }: any) => {
      expect(typeof className).toBe('string');
      return <div>hello</div>;
    };
    const Button = styled(Component, {});
    renderer.create(<Button size={{ breakpointOne: 'small' }}>with responsive variant</Button>);
  });

  test('It handles variants with a numeric value of 0', () => {
    const Button = styled('button', {
      variants: {
        size: {
          0: {
            height: '1px',
          },
        },
      },
    });
    expect(renderer.create(<Button size={0}>height should equal '1px'</Button>).toJSON()).toMatchSnapshot();
  });
});
