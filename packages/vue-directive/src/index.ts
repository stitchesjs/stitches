import { TCss } from "@stitches/css";

interface Binding {
  oldValue?: string;
  value: string;
  arg?: string;
}

export const createDirective = <T extends TCss<any>>(css: T) => {
  function convertToClassNames(
    value: string | { [key: string]: boolean },
    screen?: string
  ) {
    const classnames =
      typeof value === "string"
        ? value.split(" ")
        : Object.keys(value).reduce<string[]>(
            (aggr, key) => (value[key] ? aggr.concat(key) : aggr),
            []
          );

    const props = classnames.map((className) => className.split("-"));

    return css
      .compose(
        ...props.map((propParts) => {
          const pseudos = propParts.shift()!.split(":");
          const cssProp = pseudos.pop()!;
          const cssValue = propParts.join("-");
          const pseudo = pseudos.map((pseudoPart) => `:${pseudoPart}`).join("");

          if (screen && pseudo) {
            return css({ [screen]: { [pseudo]: { [cssProp]: cssValue } } });
          }
          if (screen) {
            return css({ [screen]: { [cssProp]: cssValue } });
          }
          if (pseudo) {
            return css({ [pseudo]: { [cssProp]: cssValue } });
          }

          // @ts-ignore
          return css({ [cssProp]: cssValue });
        })
      )
      .toString();
  }
  function bind(el: HTMLElement, binding: Binding) {
    if (!binding.oldValue || binding.oldValue !== binding.value) {
      let toReplace = "";
      if (binding.oldValue) {
        toReplace = convertToClassNames(binding.oldValue, binding.arg);
      }
      el.className = `${el.className.replace(
        toReplace,
        ""
      )} ${convertToClassNames(binding.value, binding.arg)}`;
    }
  }
  return {
    update: bind,
    bind,
    unbind: (el: HTMLElement, binding: Binding) => {
      el.className = el.className.replace(
        convertToClassNames(binding.value, binding.arg),
        ""
      );
    },
  };
};
