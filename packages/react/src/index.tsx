import {
  MAIN_BREAKPOINT_ID,
  TConfig,
  TCss,
  TCssProperties,
  TMainBreakPoint,
  createCss,
  hashString,
} from '@stitches/core';
export { _ATOM } from '@stitches/core';
import * as React from 'react';

let hasWarnedInlineStyle = false;

export type TCssProp<T extends TConfig> = TCssProperties<T> | (string & {});

/**
 * Extracts Variants from an object:
 */
export type TExtractVariants<Styles> = Styles extends {
  variants: infer Variants;
}
  ? { [a in keyof Variants]: keyof Variants[a] }
  : {};

/**
 * Extracts Breakpoint keys from a config
 */
export type BreakPointsKeys<Config extends TConfig> = keyof Config['breakpoints'];

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
 * Takes a variants object and converts it to the correct type information for usage in props
 */
export type VariantASProps<Config extends TConfig, VariantsObj> = {
  [V in keyof VariantsObj]?:
    | CastStringToBoolean<VariantsObj[V]>
    | VariantsObj[V]
    | CastNumberToString<VariantsObj[V]>
    | {
        [B in BreakPointsKeys<Config> | TMainBreakPoint]?:
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
export interface IStyledComponent<ComponentOrTag extends React.ElementType, Variants, Config extends TConfig> {
  /**
   * Props of a styled component
   */
  <As extends React.ElementType = ComponentOrTag>(
    // Merge native props with variant props to prevent props clashing.
    // e.g. some HTML elements have `size` attribute. And when you combine
    // both types (native and variant props) the common props become
    // unusable (in typing-wise)
    props: MergeElementProps<As, VariantASProps<Config, Variants>> & {
      as?: As;
      css?: TCssWithBreakpoints<Config>;
      className?: string;
      children?: any;
    }
  ): any;
  /**
   * Compound Variant typing:
   */
  compoundVariant: (
    compoundVariants: VariantASProps<Config, Variants>,
    possibleValues: TCssWithBreakpoints<Config>
  ) => IStyledComponent<ComponentOrTag, Variants, Config>;
  /**
   * Default props typing:
   */
  defaultProps?: VariantASProps<Config, Variants> & { [k: string]: any };
  /**
   * DisplayName typing:
   */
  displayName?: string;
}

/** Typed css with tokens and breakpoints */
export type TCssWithBreakpoints<Config extends TConfig> = TCssProp<Config> &
  { [key in BreakPointsKeys<Config>]?: TCssProp<Config> };

/** The type for the styles in a styled call */
export type TComponentStylesObject<Config extends TConfig> = TCssWithBreakpoints<Config> & {
  variants?: {
    [k: string]: {
      [s: string]: TCssWithBreakpoints<Config>;
    };
  };
};
/**
 * Types for styled.button, styled.div, etc..
 */
export type TProxyStyledElements<Config extends TConfig> = {
  [key in keyof JSX.IntrinsicElements]: <BaseAndVariantStyles extends TComponentStylesObject<Config>>(
    a: BaseAndVariantStyles | TComponentStylesObject<Config>
  ) => IStyledComponent<key, TExtractVariants<BaseAndVariantStyles>, Config>;
};
/**
 * Styled Components creator Type.
 * ie: styled.div(styles) | styled('div', {styles})
 */
export type TStyled<Config extends TConfig> = {
  // tslint:disable-next-line: callable-types
  <
    TagOrComponent extends keyof JSX.IntrinsicElements | React.ComponentType<any> | IStyledComponent<any, any, Config>,
    BaseAndVariantStyles extends TComponentStylesObject<Config>,
    Variants = TExtractVariants<BaseAndVariantStyles>
  >(
    tag: TagOrComponent,
    baseStyles: BaseAndVariantStyles | TComponentStylesObject<Config>
  ): TagOrComponent extends IStyledComponent<infer T, infer V, Config>
    ? IStyledComponent<T, Omit<V, keyof Variants> & Variants, Config>
    : IStyledComponent<TagOrComponent, Variants, Config>;
} & TProxyStyledElements<Config>;

const createCompoundVariantsMatcher = (breakPoints: any, existingMap?: any) => {
  const map = new Map();
  map.set(MAIN_BREAKPOINT_ID, [...(existingMap?.get(MAIN_BREAKPOINT_ID) || [])]);
  Object.keys(breakPoints).forEach((breakpoint) => map.set(breakpoint, [...(existingMap?.get(breakpoint) || [])]));
  return map;
};

export const createStyled = <Config extends TConfig>(
  config: Config
): {
  css: TCss<Config>;
  styled: TStyled<Config>;
} => {
  const css = createCss(config);
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
      // Check the memoCompsition's identity to warn the user
      // remove in production
      if (process.env.NODE_ENV === 'development') {
        // we're breaking the rules of hooks on purpose as the env will never change
        // eslint-disable-next-line
        const memoStyled = React.useMemo(() => props.css, []); // We want this to only eval once
        if (memoStyled !== props.css && !hasWarnedInlineStyle) {
          // tslint:disable-next-line
          console.warn(
            '@stitches/react : The css prop should ideally not be dynamic. Define it outside your component using the css composer, or use a memo hook'
          );
          hasWarnedInlineStyle = true;
        }
      }

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

      return React.createElement(Component, {
        ...propsWithoutVariantsAndCssProp,
        as: props.as || as,
        ref,
        className: css(stitchesComponentId, ...compositions, props.className).toString(),
      });
    });
    StitchesComponent.displayName =
      typeof currentAs === 'string'
        ? `styled(${currentAs})`
        : Component && Component.displayName
        ? `styled(${Component.displayName})`
        : `styled(Component\)`;

    StitchesComponent.toString = () => `.${stitchesComponentId}`;

    (StitchesComponent as any).compoundVariant = (compundVariantsObject: any, compoundVariantStyles: any) => {
      // Update component level variables:
      numberOfCompoundVariants++;
      // Each time we add
      compoundVariants.push(compundVariantsObject);
      // required matches is a map with breakpoints
      // each time we add a compound variant, we also push its length to
      // all of the breakpoints so:
      // requiredMatches.get(breakpoint)[i] === Object.keys(compoundVariants[i]).length
      // at render time we clone the requiredMatches map and whenever a prop matches a compound variant we decrement
      // the required matches for this compound variant at this breakpoint
      // when the required matches hit 0 we know it's a mtach
      requiredMatches.forEach((value, key) => {
        value.push(Object.keys(compundVariantsObject).length);
      });

      const evaluatedStyles = evaluateStylesForAllBreakpoints(compoundVariantStyles, configBreakpoints, css);

      evaluatedCompoundVariants.set(compundVariantsObject, evaluatedStyles);
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
    styled: styledProxy as any,
    css,
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
