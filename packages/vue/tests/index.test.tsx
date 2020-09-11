import * as Vue from 'vue';
import { mount } from '@vue/test-utils';
import { _ATOM } from '@stitches/core';
import { createStyled } from '../src';

let { styled, css } = createStyled({});

beforeEach(() => {
  const newStyled = createStyled({});
  styled = newStyled.styled;
  css = newStyled.css;
});

afterEach(() => {
  (css as any).dispose();
});

describe('styled - vue', () => {
  test('Renders basic component', () => {
    const Heading = styled('h1', {
      color: 'red',
    });

    const App = () => <Heading>Hello World!</Heading>;

    const mountedApp = mount(App);

    expect(mountedApp.html()).toMatchSnapshot();
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

    const App = () => (
      <div>
        <Button>Hello World!</Button>
        <Button variant="red">Hello World!</Button>
        <Button variant="blue">Hello World!</Button>
      </div>
    );

    const mountedApp = mount(App);

    expect(mountedApp.html()).toMatchSnapshot();
  });

  test('Handles css prop', () => {
    const Button = styled('button', {
      backgroundColor: 'gray',
    });

    const App = () => <Button css={{ color: 'red' }}>Hello World</Button>;

    const mountedApp = mount(App);

    expect(mountedApp.html()).toMatchSnapshot();
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

    const App = () => (
      <>
        <Button variant="red" size={2}>
          not compound
        </Button>
        <Button variant="red" size={1}>
          compound
        </Button>
      </>
    );

    const mountedApp = mount(App);

    expect(mountedApp.html()).toMatchSnapshot();
  });

  test('It has default displayName when a string based element is passed', () => {
    const Button = styled('button', {});
    expect(Button.displayName).toBe('styled(button)');
  });

  test('It defaults to styled(component) when styling a component that has no displayName', () => {
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
    const App = () => <Button>no variant</Button>;
    const mountedApp = mount(App);

    expect(mountedApp.html()).toMatchSnapshot();

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
    const App = () => <Button size="big">with variant</Button>;
    const mountedApp = mount(App);

    expect(mountedApp.html()).toMatchSnapshot();

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
    const App = () => <Button size={{ breakpointOne: 'small' }}>with responsive variant</Button>;
    const mountedApp = mount(App);

    expect(mountedApp.html()).toMatchSnapshot();
    (_css as any).dispose();
  });
});
