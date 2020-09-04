import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { createStyled, _ATOM } from '../src';

/**
 * TODO: improve serializer to handle multiple breakpoints, recursion and media queries
 */
let { styled, css } = createStyled({});
const resolveVal = (val: any) => {
  const { className, ...props } = val.props;
  const orderedAppliedStyles: string[] = [];
  // inject styles by calling to string on the atom
  const injectedClasses = className.toString();
  const classesAsArray = injectedClasses.split(' ').map((atomClass: any) => `.${atomClass}`);

  const mainSheetRules = window.document.styleSheets[1].cssRules;
  for (let index = 0; index < mainSheetRules.length; index++) {
    const rule = mainSheetRules[index] as CSSStyleRule;
    classesAsArray.forEach((atomClass: any) => {
      if (rule!.selectorText.includes(atomClass)) {
        orderedAppliedStyles.push(rule.cssText);
      }
    });
  }
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
    return val && val.props && val.props.className[_ATOM] && val.children && val.type;
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
});
