import {
  IBreakpoints,
  TConfig,
  TCss,
  TDefaultCss,
  TUtilityFirstCss,
  createCss,
  hashString,
} from "@stitches/css";
import * as React from "react";

interface IntrinsicElements {
  // HTML
  a: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  abbr: React.HTMLAttributes<HTMLElement>;
  address: React.HTMLAttributes<HTMLElement>;
  // area: React.AreaHTMLAttributes<HTMLAreaElement>;
  article: React.HTMLAttributes<HTMLElement>;
  aside: React.HTMLAttributes<HTMLElement>;
  // audio: React.AudioHTMLAttributes<HTMLAudioElement>;
  // b: React.HTMLAttributes<HTMLElement>;
  // base: React.BaseHTMLAttributes<HTMLBaseElement>;
  // bdi: React.HTMLAttributes<HTMLElement>;
  // bdo: React.HTMLAttributes<HTMLElement>;
  // big: React.HTMLAttributes<HTMLElement>;
  blockquote: React.BlockquoteHTMLAttributes<HTMLElement>;
  body: React.HTMLAttributes<HTMLBodyElement>;
  br: React.HTMLAttributes<HTMLBRElement>;
  button: React.ButtonHTMLAttributes<HTMLButtonElement>;
  canvas: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  caption: React.HTMLAttributes<HTMLElement>;
  cite: React.HTMLAttributes<HTMLElement>;
  code: React.HTMLAttributes<HTMLElement>;
  col: React.ColHTMLAttributes<HTMLTableColElement>;
  colgroup: React.ColgroupHTMLAttributes<HTMLTableColElement>;
  data: React.DataHTMLAttributes<HTMLDataElement>;
  datalist: React.HTMLAttributes<HTMLDataListElement>;
  dd: React.HTMLAttributes<HTMLElement>;
  // del: React.DelHTMLAttributes<HTMLElement>;
  details: React.DetailsHTMLAttributes<HTMLElement>;
  dfn: React.HTMLAttributes<HTMLElement>;
  dialog: React.DialogHTMLAttributes<HTMLDialogElement>;
  div: React.HTMLAttributes<HTMLDivElement>;
  dl: React.HTMLAttributes<HTMLDListElement>;
  dt: React.HTMLAttributes<HTMLElement>;
  // em: React.HTMLAttributes<HTMLElement>;
  embed: React.EmbedHTMLAttributes<HTMLEmbedElement>;
  fieldset: React.FieldsetHTMLAttributes<HTMLFieldSetElement>;
  figcaption: React.HTMLAttributes<HTMLElement>;
  figure: React.HTMLAttributes<HTMLElement>;
  footer: React.HTMLAttributes<HTMLElement>;
  form: React.FormHTMLAttributes<HTMLFormElement>;
  h1: React.HTMLAttributes<HTMLHeadingElement>;
  h2: React.HTMLAttributes<HTMLHeadingElement>;
  h3: React.HTMLAttributes<HTMLHeadingElement>;
  h4: React.HTMLAttributes<HTMLHeadingElement>;
  h5: React.HTMLAttributes<HTMLHeadingElement>;
  h6: React.HTMLAttributes<HTMLHeadingElement>;
  head: React.HTMLAttributes<HTMLHeadElement>;
  header: React.HTMLAttributes<HTMLElement>;
  hgroup: React.HTMLAttributes<HTMLElement>;
  hr: React.HTMLAttributes<HTMLHRElement>;
  // html: React.HtmlHTMLAttributes<HTMLHtmlElement>;
  i: React.HTMLAttributes<HTMLElement>;
  iframe: React.IframeHTMLAttributes<HTMLIFrameElement>;
  img: React.ImgHTMLAttributes<HTMLImageElement>;
  input: React.InputHTMLAttributes<HTMLInputElement>;
  ins: React.InsHTMLAttributes<HTMLModElement>;
  kbd: React.HTMLAttributes<HTMLElement>;
  // keygen: React.KeygenHTMLAttributes<HTMLElement>;
  label: React.LabelHTMLAttributes<HTMLLabelElement>;
  legend: React.HTMLAttributes<HTMLLegendElement>;
  li: React.LiHTMLAttributes<HTMLLIElement>;
  link: React.LinkHTMLAttributes<HTMLLinkElement>;
  // main: React.HTMLAttributes<HTMLElement>;
  // map: React.MapHTMLAttributes<HTMLMapElement>;
  // mark: React.HTMLAttributes<HTMLElement>;
  menu: React.MenuHTMLAttributes<HTMLElement>;
  menuitem: React.HTMLAttributes<HTMLElement>;
  meta: React.MetaHTMLAttributes<HTMLMetaElement>;
  // meter: React.MeterHTMLAttributes<HTMLElement>;
  nav: React.HTMLAttributes<HTMLElement>;
  // noindex: React.HTMLAttributes<HTMLElement>;
  // noscript: React.HTMLAttributes<HTMLElement>;
  object: React.ObjectHTMLAttributes<HTMLObjectElement>;
  ol: React.OlHTMLAttributes<HTMLOListElement>;
  optgroup: React.OptgroupHTMLAttributes<HTMLOptGroupElement>;
  option: React.OptionHTMLAttributes<HTMLOptionElement>;
  output: React.OutputHTMLAttributes<HTMLElement>;
  p: React.HTMLAttributes<HTMLParagraphElement>;
  // param: React.ParamHTMLAttributes<HTMLParamElement>;
  picture: React.HTMLAttributes<HTMLElement>;
  pre: React.HTMLAttributes<HTMLPreElement>;
  // progress: React.ProgressHTMLAttributes<HTMLProgressElement>;
  q: React.QuoteHTMLAttributes<HTMLQuoteElement>;
  rp: React.HTMLAttributes<HTMLElement>;
  rt: React.HTMLAttributes<HTMLElement>;
  // ruby: React.HTMLAttributes<HTMLElement>;
  s: React.HTMLAttributes<HTMLElement>;
  // samp: React.HTMLAttributes<HTMLElement>;
  // slot: React.SlotHTMLAttributes<HTMLSlotElement>;
  // script: React.ScriptHTMLAttributes<HTMLScriptElement>;
  section: React.HTMLAttributes<HTMLElement>;
  select: React.SelectHTMLAttributes<HTMLSelectElement>;
  // small: React.HTMLAttributes<HTMLElement>;
  // source: React.SourceHTMLAttributes<HTMLSourceElement>;
  span: React.HTMLAttributes<HTMLSpanElement>;
  // strong: React.HTMLAttributes<HTMLElement>;
  // style: React.StyleHTMLAttributes<HTMLStyleElement>;
  sub: React.HTMLAttributes<HTMLElement>;
  summary: React.HTMLAttributes<HTMLElement>;
  // sup: React.HTMLAttributes<HTMLElement>;
  table: React.TableHTMLAttributes<HTMLTableElement>;
  // template: React.HTMLAttributes<HTMLTemplateElement>;
  tbody: React.HTMLAttributes<HTMLTableSectionElement>;
  td: React.TdHTMLAttributes<HTMLTableDataCellElement>;
  textarea: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  tfoot: React.HTMLAttributes<HTMLTableSectionElement>;
  th: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;
  thead: React.HTMLAttributes<HTMLTableSectionElement>;
  // time: React.TimeHTMLAttributes<HTMLElement>;
  title: React.HTMLAttributes<HTMLTitleElement>;
  tr: React.HTMLAttributes<HTMLTableRowElement>;
  track: React.TrackHTMLAttributes<HTMLTrackElement>;
  u: React.HTMLAttributes<HTMLElement>;
  ul: React.HTMLAttributes<HTMLUListElement>;
  // var: React.HTMLAttributes<HTMLElement>;
  // video: React.VideoHTMLAttributes<HTMLVideoElement>;
  // wbr: React.HTMLAttributes<HTMLElement>;
  // webview: React.WebViewHTMLAttributes<HTMLWebViewElement>;

  // SVG
  svg: React.SVGProps<SVGSVGElement>;

  // animate: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
  // animateMotion: React.SVGProps<SVGElement>;
  // animateTransform: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
  circle: React.SVGProps<SVGCircleElement>;
  clipPath: React.SVGProps<SVGClipPathElement>;
  // defs: React.SVGProps<SVGDefsElement>;
  // desc: React.SVGProps<SVGDescElement>;
  ellipse: React.SVGProps<SVGEllipseElement>;
  // feBlend: React.SVGProps<SVGFEBlendElement>;
  // feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
  // feComponentTransfer: React.SVGProps<SVGFEComponentTransferElement>;
  // feComposite: React.SVGProps<SVGFECompositeElement>;
  // feConvolveMatrix: React.SVGProps<SVGFEConvolveMatrixElement>;
  // feDiffuseLighting: React.SVGProps<SVGFEDiffuseLightingElement>;
  // feDisplacementMap: React.SVGProps<SVGFEDisplacementMapElement>;
  // feDistantLight: React.SVGProps<SVGFEDistantLightElement>;
  // feDropShadow: React.SVGProps<SVGFEDropShadowElement>;
  // feFlood: React.SVGProps<SVGFEFloodElement>;
  // feFuncA: React.SVGProps<SVGFEFuncAElement>;
  // feFuncB: React.SVGProps<SVGFEFuncBElement>;
  // feFuncG: React.SVGProps<SVGFEFuncGElement>;
  // feFuncR: React.SVGProps<SVGFEFuncRElement>;
  // feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
  // feImage: React.SVGProps<SVGFEImageElement>;
  // feMerge: React.SVGProps<SVGFEMergeElement>;
  // feMergeNode: React.SVGProps<SVGFEMergeNodeElement>;
  // feMorphology: React.SVGProps<SVGFEMorphologyElement>;
  // feOffset: React.SVGProps<SVGFEOffsetElement>;
  // fePointLight: React.SVGProps<SVGFEPointLightElement>;
  // feSpecularLighting: React.SVGProps<SVGFESpecularLightingElement>;
  // feSpotLight: React.SVGProps<SVGFESpotLightElement>;
  // feTile: React.SVGProps<SVGFETileElement>;
  // feTurbulence: React.SVGProps<SVGFETurbulenceElement>;
  // filter: React.SVGProps<SVGFilterElement>;
  // foreignObject: React.SVGProps<SVGForeignObjectElement>;
  g: React.SVGProps<SVGGElement>;
  image: React.SVGProps<SVGImageElement>;
  line: React.SVGProps<SVGLineElement>;
  // linearGradient: React.SVGProps<SVGLinearGradientElement>;
  // marker: React.SVGProps<SVGMarkerElement>;
  // mask: React.SVGProps<SVGMaskElement>;
  // metadata: React.SVGProps<SVGMetadataElement>;
  mpath: React.SVGProps<SVGElement>;
  path: React.SVGProps<SVGPathElement>;
  // pattern: React.SVGProps<SVGPatternElement>;
  polygon: React.SVGProps<SVGPolygonElement>;
  polyline: React.SVGProps<SVGPolylineElement>;
  // radialGradient: React.SVGProps<SVGRadialGradientElement>;
  rect: React.SVGProps<SVGRectElement>;
  stop: React.SVGProps<SVGStopElement>;
  // switch: React.SVGProps<SVGSwitchElement>;
  // symbol: React.SVGProps<SVGSymbolElement>;
  text: React.SVGProps<SVGTextElement>;
  textPath: React.SVGProps<SVGTextPathElement>;
  tspan: React.SVGProps<SVGTSpanElement>;
  // use: React.SVGProps<SVGUseElement>;
  // view: React.SVGProps<SVGViewElement>;
}

type ElKeys = keyof IntrinsicElements;

type PolymorphicProps<
  P,
  E extends string | React.ComponentType,
  T extends string
> = P & {
  as?: E;
  forwardedAs?: E;
} & (E extends ElKeys
    ? IntrinsicElements[E]
    : E extends PolymorphicComponent<infer PP, infer PE>
    ? PP & (PE extends ElKeys ? IntrinsicElements[PE] : never)
    : E extends T
    ? E extends ElKeys
      ? IntrinsicElements[E]
      : never
    : never);

export interface PolymorphicComponent<P, T extends string>
  extends React.ForwardRefExoticComponent<PolymorphicProps<P, T, T>> {
  (
    props: PolymorphicProps<P, T, T> & { as?: never; forwardedAs?: never }
  ): React.ReactElement<PolymorphicProps<P, T, T>>;
  <E extends string | React.ComponentType = T>(
    props: PolymorphicProps<P, E, T>
  ): React.ReactElement<PolymorphicProps<P, E, T>>;
}

export interface IBaseStyled<CSS, BREAKPOINTS> {
  <E extends string | React.ComponentType>(
    element: E,
    css?: CSS
  ): E extends ElKeys
    ? PolymorphicComponent<{ css?: CSS | (string & {}) }, E>
    : E extends PolymorphicComponent<infer EP, infer EE>
    ? PolymorphicComponent<EP & { css?: CSS | (string & {}) }, EE>
    : E extends React.ComponentType<infer PP>
    ? PolymorphicComponent<PP & { css?: CSS | (string & {}) }, never>
    : never;
  <
    E extends ElKeys | React.ComponentType,
    V extends {
      [propKey: string]: {
        [variantName: string]: CSS;
      };
    },
    VE = {
      [P in keyof V]?: BREAKPOINTS extends IBreakpoints
        ?
            | keyof V[P]
            | false
            | null
            | undefined
            | ({
                [S in keyof BREAKPOINTS]?: keyof V[P];
              } & {
                ""?: keyof V[P];
              })
        : keyof V[P] | false | null | undefined;
    }
  >(
    element: E,
    css: CSS,
    variants: V
  ): E extends ElKeys
    ? PolymorphicComponent<
        V extends void
          ? {
              css?: CSS | (string & {});
            }
          : VE & {
              css?: CSS | (string & {});
            },
        E
      >
    : E extends PolymorphicComponent<infer EP, infer EE>
    ? PolymorphicComponent<
        V extends void
          ? EP & {
              css?: CSS | (string & {});
            }
          : EP &
              VE & {
                css?: CSS | (string & {});
              },
        EE
      >
    : E extends React.ComponentType<infer PP>
    ? PolymorphicComponent<
        V extends void
          ? PP & {
              css?: CSS | (string & {});
            }
          : VE &
              PP & {
                css?: CSS | (string & {});
              },
        never
      >
    : never;
}

interface IStyledConstructor<
  E extends string | React.ComponentType,
  CSS,
  BREAKPOINTS
> {
  (cb: CSS): E extends ElKeys
    ? PolymorphicComponent<
        {
          css?: CSS | (string & {});
        },
        E
      >
    : E extends PolymorphicComponent<infer EP, infer EE>
    ? PolymorphicComponent<
        EP & {
          css?: CSS | (string & {});
        },
        EE
      >
    : E extends React.ComponentType<infer PP>
    ? PolymorphicComponent<
        PP & {
          css?: CSS | (string & {});
        },
        never
      >
    : never;
  <
    V extends {
      [propKey: string]: {
        [variantName: string]: CSS;
      };
    },
    VE = {
      [P in keyof V]?: BREAKPOINTS extends IBreakpoints
        ?
            | false
            | null
            | undefined
            | keyof V[P]
            | ({
                [S in keyof BREAKPOINTS]?: keyof V[P];
              } & {
                ""?: keyof V[P];
              })
        : keyof V[P] | false | null | undefined;
    }
  >(
    cb: CSS,
    variants: V
  ): E extends ElKeys
    ? PolymorphicComponent<
        VE & {
          css?: CSS | (string & {});
        },
        E
      >
    : E extends PolymorphicComponent<infer EP, infer EE>
    ? PolymorphicComponent<
        EP &
          VE & {
            css?: CSS | (string & {});
          },
        EE
      >
    : E extends React.ComponentType<infer PP>
    ? PolymorphicComponent<
        PP &
          VE & {
            css?: CSS | (string & {});
          },
        never
      >
    : never;
}

export type IStyled<CSS, BREAKPOINTS> = {
  [E in ElKeys]: IStyledConstructor<E, CSS, BREAKPOINTS>;
};

let hasWarnedInlineStyle = false;

export const createStyled = <
  T extends TConfig,
  CSS = T extends { utilityFirst: true } ? TUtilityFirstCss<T> : TDefaultCss<T>,
  BREAKPOINTS = T["breakpoints"]
>(
  config: T
): {
  css: TCss<T>;
  styled: IBaseStyled<CSS, BREAKPOINTS> &
    IStyled<CSS, BREAKPOINTS> & {
      Box: <E extends ElKeys>(
        props: JSX.IntrinsicElements[E] & { as?: E }
      ) => JSX.Element;
    };
} => {
  const css = createCss(config);
  const defaultElement = "div";
  const Box = React.forwardRef((props: any, ref: React.Ref<Element>) => {
    const Element = props.as || defaultElement;

    return React.createElement(Element, {
      ref,
      ...props,
      as: undefined,
    });
  });

  let currentAs: string | undefined;

  const configBreakpoints = (css as any)._config().breakpoints;

  const styledInstance = (
    baseStyling: any = (cssComposer: any) => cssComposer.compose(),
    variants: { [variant: string]: { [name: string]: any } } = {},
    Component: React.ComponentType<any> = Box
  ) => {
    const as = currentAs;

    const baseStyles: any = css(baseStyling);
    const evaluatedVariantMap: Map<
      string,
      Map<string, { [key: string]: string }>
    > = new Map();
    // tslint:disable-next-line
    for (const variantName in variants) {
      const variantMap: Map<string, { [key: string]: string }> = new Map();
      // tslint:disable-next-line
      for (const variant in variants[variantName]) {
        const breakpoints: { [key: string]: string } = {
          "": css(variants[variantName][variant]),
        };
        if (configBreakpoints) {
          // tslint:disable-next-line
          for (const breakpoint in configBreakpoints) {
            breakpoints[breakpoint] = css({
              [breakpoint]: variants[variantName][variant],
            });
          }
        }
        variantMap.set(variant, breakpoints);
      }
      evaluatedVariantMap.set(variantName, variantMap);
    }

    const stitchesComponentId = `scid-${hashString(
      `${JSON.stringify(baseStyling)}${JSON.stringify(variants)}`
    )}`;

    const StitchesComponent = React.forwardRef(
      (props: any, ref: React.Ref<Element>) => {
        const memoStyled = React.useMemo(() => props.css, []); // We want this to only eval once

        // Check the memoCompsition's identity to warn the user
        // remove in production
        if (process.env.NODE_ENV === "development") {
          if (memoStyled !== props.css && !hasWarnedInlineStyle) {
            // tslint:disable-next-line
            console.warn(
              "@stitches/styled : The css prop should ideally not be dynamic. Define it outside your component using the css composer, or use a memo hook"
            );
            hasWarnedInlineStyle = true;
          }
        }

        const compositions = [baseStyles];

        const propsWithoutVariantsAndCssProp: any = {};

        for (const propName in props) {
          if (propName in variants) {
            const breakpoints = evaluatedVariantMap.get(propName);

            // check if prop value is a string and not an empty string
            // otherwise assume its a responsive object
            if (
              typeof props[propName] === "string" &&
              Boolean(props[propName])
            ) {
              // if a variant value has been provided, check it exists
              // this prevents invalid variant values from crashing
              if (breakpoints?.get(props[propName])) {
                compositions.push(breakpoints?.get(props[propName])![""]);
              }
            } else if (props[propName]) {
              // tslint:disable-next-line
              for (const breakpoint in props[propName]) {
                compositions.push(
                  breakpoints?.get(props[propName][breakpoint])![breakpoint]
                );
              }
            }
          } else {
            propsWithoutVariantsAndCssProp[propName] = props[propName];
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
          className: `${stitchesComponentId} ${css(
            ...compositions,
            props.className
          )}`,
        });
      }
    );

    StitchesComponent.toString = () => `.${stitchesComponentId}`;

    return StitchesComponent;
  };

  // tslint:disable-next-line
  const styledProxy = new Proxy(() => {}, {
    get(_, prop) {
      if (prop === "Box") {
        return Box;
      }
      currentAs = String(prop);
      return styledInstance;
    },
    apply(_, __, [Element, styling, variants]) {
      if (typeof Element === "string") {
        currentAs = Element;
        return styledInstance(styling, variants);
      }
      currentAs = undefined;
      return styledInstance(styling, variants, Element);
    },
  });

  return {
    styled: styledProxy as any,
    css,
  };
};
