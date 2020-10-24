import {
  MAIN_BREAKPOINT_ID,
  IConfig,
  TCss,
  TMainBreakPoint,
  createCss,
  hashString,
  TBreakpoints,
  ITokensDefinition,
  TTokens,
  TUtils,
  StitchesCSS,
} from '@stitches/core';
export { _ATOM, StitchesCSS } from '@stitches/core';
import * as React from 'react';

/**
 * Extracts Variants from an object:
 */
export type TExtractVariants<Styles> = Styles extends {
  variants: infer Variants;
}
  ? { [a in keyof Variants]: keyof Variants[a] }
  : {};

/**
 * Takes a value and if it's one of the string type representations of a boolean ('true' | 'false')
 * it adds the actual boolean values to it
 */
export type CastStringToBoolean<Val> = Val extends 'true' | 'false' ? boolean | 'true' | 'false' : never;
/**
 * adds the string type to number while also preserving autocomplete for other string values
 */
export type CastNumberToString<Val> = Val extends number ? string & {} : never;

/**
 * Extract variant props from a Stitches component
 */
export type StitchesVariants<C> = C extends IStyledComponent<any, infer V, infer Breakpoints>
  ? VariantASProps<Extract<keyof Breakpoints, string>, V>
  : never;

/**
 * Extracts the props from a Stitches component
 *
 */
export type StitchesProps<C> = C extends IStyledComponent<
  infer T,
  infer V,
  infer Breakpoints,
  infer Utils,
  infer Tokens,
  infer Strict
>
  ? MergeElementProps<T, VariantASProps<Extract<keyof Breakpoints, string>, V>> & {
      as?: T;
      css?: StitchesCSS<Breakpoints, Utils, Tokens, Strict>;
      className?: string;
      children?: any;
    }
  : never;

/**
 * Takes a variants object and converts it to the correct type information for usage in props
 */
export type VariantASProps<BreakpointKeys extends string, VariantsObj> = {
  [V in keyof VariantsObj]?:
    | CastStringToBoolean<VariantsObj[V]>
    | VariantsObj[V]
    | CastNumberToString<VariantsObj[V]>
    | {
        [B in BreakpointKeys | TMainBreakPoint]?:
          | CastStringToBoolean<VariantsObj[V]>
          | VariantsObj[V]
          | CastNumberToString<VariantsObj[V]>;
      };
};

type MergeElementProps<As extends React.ElementType, Props extends object = {}> = Omit<
  React.ComponentPropsWithRef<As>,
  keyof Props
> &
  Props;

/**
 * Types for a styled component which contain:
 * 1. Props of a styled component
 * 2. The compoundVariants function typings
 */
export interface IStyledComponent<
  ComponentOrTag extends React.ElementType,
  Variants,
  BreakpointKeys extends TBreakpoints = {},
  Utils extends TUtils = {},
  Tokens extends TTokens = {},
  Strict extends boolean = false
> extends React.FC<
    MergeElementProps<ComponentOrTag, VariantASProps<Extract<keyof BreakpointKeys, string>, Variants>> & {
      css?: StitchesCSS<BreakpointKeys, Tokens, Utils, Strict>;
      className?: string;
      children?: any;
    }
  > {
  /**
   * Props of a styled component
   */
  (
    props: MergeElementProps<ComponentOrTag, VariantASProps<Extract<keyof BreakpointKeys, string>, Variants>> & {
      as?: never;
      css?: StitchesCSS<BreakpointKeys, Tokens, Utils, Strict>;
      className?: string;
      children?: any;
    }
  ): any;
  // Second overload (with as prop):
  <As extends React.ElementType = ComponentOrTag>(
    // Merge native props with variant props to prevent props clashing.
    // e.g. some HTML elements have `size` attribute. And when you combine
    // both types (native and variant props) the common props become
    // unusable (in typing-wise)
    props: MergeElementProps<As, VariantASProps<Extract<keyof BreakpointKeys, string>, Variants>> & {
      as?: As;
      css?: StitchesCSS<BreakpointKeys, Tokens, Utils, Strict>;
      className?: string;
      children?: any;
    }
  ): any;
  /**
   * Compound Variant typing:
   */
  compoundVariant: (
    compoundVariants: VariantASProps<Extract<keyof BreakpointKeys, string>, Variants>,
    possibleValues: StitchesCSS<BreakpointKeys, Tokens, Utils, Strict>
  ) => IStyledComponent<ComponentOrTag, Variants, BreakpointKeys, Utils, Tokens, Strict>;

  /**
   * @deprecated
   */
  defaultProps?: never;
}

/** The type for the styles in a styled call */
export type TComponentStylesObject<
  BreakpointKeys extends TBreakpoints = {},
  Utils extends TUtils = {},
  Tokens extends TTokens = {},
  Strict extends boolean = false
> = StitchesCSS<BreakpointKeys, Tokens, Utils, Strict> & {
  variants?: {
    [k: string]: {
      [s: string]: StitchesCSS<BreakpointKeys, Tokens, Utils, Strict>;
    };
  };
};

/**
 * Types for styled.button, styled.div, etc..
 */
export type TProxyStyledElements<
  BreakpointKeys extends TBreakpoints = {},
  Utils extends TUtils = {},
  Tokens extends TTokens = {},
  Strict extends boolean = false
> = {
  [key in keyof JSX.IntrinsicElements]: <
    BaseAndVariantStyles extends TComponentStylesObject<BreakpointKeys, Utils, Tokens, Strict>
  >(
    a: BaseAndVariantStyles | TComponentStylesObject<BreakpointKeys, Utils, Tokens, Strict>
  ) => IStyledComponent<key, TExtractVariants<BaseAndVariantStyles>, BreakpointKeys, Utils, Tokens, Strict>;
};

/**
 * Styled Components creator Type.
 * ie: styled.div(styles) | styled('div', {styles})
 */
export type TStyled<
  BreakpointKeys extends TBreakpoints = {},
  Utils extends TUtils = {},
  Tokens extends TTokens = {},
  Strict extends boolean = false
> = {
  // tslint:disable-next-line: callable-types
  <
    TagOrComponent extends
      | keyof JSX.IntrinsicElements
      | React.ComponentType<any>
      | IStyledComponent<any, any, BreakpointKeys, Utils, Tokens, Strict>,
    BaseAndVariantStyles extends TComponentStylesObject<BreakpointKeys, Utils, Tokens, Strict>,
    Variants = TExtractVariants<BaseAndVariantStyles>
  >(
    tag: TagOrComponent,
    baseStyles: BaseAndVariantStyles | TComponentStylesObject<BreakpointKeys, Utils, Tokens, Strict>
  ): TagOrComponent extends IStyledComponent<infer T, infer V>
    ? IStyledComponent<T, Omit<V, keyof Variants> & Variants, BreakpointKeys, Utils, Tokens, Strict>
    : IStyledComponent<TagOrComponent, Variants, BreakpointKeys, Utils, Tokens, Strict>;
} & TProxyStyledElements<BreakpointKeys, Utils, Tokens, Strict>;

const createCompoundVariantsMatcher = (breakPoints: any, existingMap?: any) => {
  const map = new Map();
  map.set(MAIN_BREAKPOINT_ID, [...(existingMap?.get(MAIN_BREAKPOINT_ID) || [])]);
  Object.keys(breakPoints).forEach((breakpoint) => map.set(breakpoint, [...(existingMap?.get(breakpoint) || [])]));
  return map;
};

// tslint:disable-next-line:prettier
export const createStyled = <
  // tslint:disable-next-line
  A extends TBreakpoints = {},
  B extends TTokens = {},
  C extends boolean = false,
  D extends boolean = false,
  E extends string = '',
  F extends TUtils = {}
>(
  config: Partial<IConfig<A, B, C, D, E, F>>
): {
  css: TCss<A, B, C, F>;
  styled: TStyled<A, F, B, C>;
} => {
  const css: any = createCss(config);
  const defaultElement = 'div';
  const Box = React.forwardRef((props: any, ref: React.Ref<Element>) => {
    const Element = props.as || defaultElement;

    return React.createElement(Element, {
      ref,
      ...props,
      as: undefined,
    });
  });

  let currentAs: string | undefined;

  const configBreakpoints = config.breakpoints || {};

  const styledInstance = (
    baseAndVariantStyles: any = (cssComposer: any) => cssComposer.compose(),
    Component: React.ComponentType<any> = Box
  ) => {
    let numberOfCompoundVariants = 0;
    const as = currentAs;
    const { variants = {}, ...base } = baseAndVariantStyles;
    const baseStyles: any = css(base);
    // compound s vars & constants:
    // keep track of all compound variants:
    const compoundVariants: any[] = [];
    // a map that keeps track of the required number of matching s left for each break point:
    const requiredMatches = createCompoundVariantsMatcher(configBreakpoints);
    // keep track of the number of available variants
    const evaluatedVariantMap: Map<string, Map<string, { [key: string]: string }>> = new Map();
    // store pre evaluated variants
    const evaluatedCompoundVariants: Map<any, { [key: string]: string }> = new Map();

    // tslint:disable-next-line: forin
    for (const Name in variants) {
      const variantMap: Map<string, { [key: string]: string }> = new Map();
      // tslint:disable-next-line: forin
      for (const ValueName in variants[Name]) {
        const evaluatedStyles = evaluateStylesForAllBreakpoints(variants[Name][ValueName], configBreakpoints, css);
        variantMap.set(ValueName, evaluatedStyles);
      }
      evaluatedVariantMap.set(Name, variantMap);
    }

    const stitchesComponentId = `scid-${hashString(JSON.stringify(baseAndVariantStyles))}`;

    const StitchesComponent = React.forwardRef((props: any, ref: React.Ref<Element>) => {
      const compositions = [baseStyles];

      const propsWithoutVariantsAndCssProp: any = {};
      // clone the compound s matcher
      const compoundRequiredMatches = createCompoundVariantsMatcher(configBreakpoints, requiredMatches);
      // keep track of the number of unResolved s so that we could bail early:
      const numberOfUnResolvedCompoundVariants = {
        current: numberOfCompoundVariants,
      };
      for (const key in props) {
        // check if the prop is a variant
        if (key in variants) {
          const evaluatedVariant = evaluatedVariantMap.get(key);
          // normalize the value so that we only have to deal with one structure:
          const keyVal =
            props[key] && typeof props[key] === 'object' ? props[key] : { [MAIN_BREAKPOINT_ID]: props[key] };
          // tslint:disable-next-line: forin
          for (const breakpoint in keyVal) {
            const stringBreakpointVal = String(keyVal[breakpoint]);
            // check if the variant exist for this breakpoint
            if (evaluatedVariant && evaluatedVariant.get(stringBreakpointVal)) {
              compositions.push(evaluatedVariant.get(stringBreakpointVal)?.[breakpoint]);
            }
            /** Compound variants: */
            if (numberOfUnResolvedCompoundVariants.current) {
              compoundVariants.forEach((compoundVariant, i) => {
                // if this breakpoint  matches a compound
                // eslint-disable-next-line
                if (stringBreakpointVal === String(compoundVariant[key])) {
                  compoundRequiredMatches.get(breakpoint)[i]--;
                }
                // when the required matches reach 0 for any compound ...
                // we know we have a matched compoundVariant
                if (compoundRequiredMatches.get(breakpoint)[i] === 0) {
                  numberOfUnResolvedCompoundVariants.current--;
                  compositions.push(evaluatedCompoundVariants.get(compoundVariant)?.[breakpoint]);
                }
              });
            }
            /** End compound variants */
          }
        } else {
          propsWithoutVariantsAndCssProp[key] = props[key];
        }
      }

      if (propsWithoutVariantsAndCssProp.css) {
        compositions.push(propsWithoutVariantsAndCssProp.css);
        propsWithoutVariantsAndCssProp.css = undefined;
      }

      // By default we don't stringify the classname (composition), so that
      // the children Stitches component is responsible for the final composition
      let className = css(stitchesComponentId, ...compositions, props.className);

      // If we're not wrapping a Stitches component,
      // we ensure the classname is stringified
      // https://github.com/modulz/stitches/issues/229
      if (!(Component as any).__isStitchesComponent) {
        className = className.toString();
      }

      return React.createElement(Component, {
        ...propsWithoutVariantsAndCssProp,
        as: props.as || as,
        ref,
        className,
      });
    });

    (StitchesComponent as any).__isStitchesComponent = true;

    // StitchesComponent.displayName =
    //   typeof currentAs === 'string'
    //     ? `styled(${currentAs})`
    //     : Component && Component.displayName
    //     ? `styled(${Component.displayName})`
    //     : `styled(Component\)`;

    StitchesComponent.toString = () => `.${stitchesComponentId}`;

    (StitchesComponent as any).compoundVariant = (compoundVariantsObject: any, compoundVariantStyles: any) => {
      // Update component level variables:
      numberOfCompoundVariants++;
      // Each time we add
      compoundVariants.push(compoundVariantsObject);
      // required matches is a map with breakpoints
      // each time we add a compound variant, we also push its length to
      // all of the breakpoints so:
      // requiredMatches.get(breakpoint)[i] === Object.keys(compoundVariants[i]).length
      // at render time we clone the requiredMatches map and whenever a prop matches a compound variant we decrement
      // the required matches for this compound variant at this breakpoint
      // when the required matches hit 0 we know it's a mtach
      requiredMatches.forEach((value, key) => {
        value.push(Object.keys(compoundVariantsObject).length);
      });

      const evaluatedStyles = evaluateStylesForAllBreakpoints(compoundVariantStyles, configBreakpoints, css);

      evaluatedCompoundVariants.set(compoundVariantsObject, evaluatedStyles);
      return StitchesComponent;
    };
    return StitchesComponent;
  };

  // tslint:disable-next-line
  const styledProxy = new Proxy(() => {}, {
    get(_, prop) {
      if (prop === 'Box') {
        return Box;
      }
      currentAs = String(prop);
      return styledInstance;
    },
    apply(_, __, [Element, styling]) {
      if (typeof Element === 'string') {
        currentAs = Element;
        return styledInstance(styling);
      }
      currentAs = undefined;
      return styledInstance(styling, Element);
    },
  });

  return {
    // both of these are typed externally
    // so casting here is only meant for the library internals
    // so that the types won't collide
    styled: styledProxy as any,
    css: css as any,
  };
};
function evaluateStylesForAllBreakpoints(styleObject: any, configBreakpoints: any, css: any) {
  const breakpoints: { [key: string]: string } = {
    [MAIN_BREAKPOINT_ID]: css(styleObject),
  };
  if (configBreakpoints) {
    // tslint:disable-next-line
    for (const breakpoint in configBreakpoints) {
      breakpoints[breakpoint] = css({
        [breakpoint]: styleObject,
      });
    }
  }
  return breakpoints;
}

export const { css: _css, styled } = createStyled({
  breakpoints: {
    hellothere: () => ``,
  },
  utils: {
    hi: (val: 'hi', config) => ({}),
    maxthisshit: (val: number, config) => ({ h: val }),
  },
  tokens: {
    sizes: {},
    space: {},
    colors: {
      red100: 'tomato',
      blue100: 'tomato',
    },
  },
});
export const buttonClass = _css({
  position: 'fixed',
  hiz: {
    background: 'ActiveBorder',
    hello: {
      background: 'red',
      nice: {
        background: 'hotpink',
      },
    },
  },
  hellothere: {
    paddingBlock: '',
    padding: 'inherit',
    backgroundColor: 'red100',
    hmmm: {
      backgroundColor: 'red',
      hellothere: {
        backgroundColor: 'red100',
      },
    },
  },
});
export const keyframe = _css.keyframes({
  back: {
    backgroundColor: 'red100',
  },
});

export const global = _css.global({
  hello: {
    backdropFilter: 'initial',
    backgroundColor: 'red100',
  },
});

export const Button = styled.button({
  padding: 'inherit',
  backgroundColor: 'bisque',
  variants: {
    variant: {
      red: {
        background: 'red',
      },
    },
  },
});

Button.compoundVariant(
  { variant: 'red' },
  {
    color: 'red100',
  }
);

export const A = styled('a', {
  borderWidth: 'medium',
  padding: 'inherit',
  backgroundColor: 'red100',
  variants: {
    variant: {
      red: {
        backgroundColor: 'red100',
      },
    },
  },
});
