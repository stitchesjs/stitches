Use stitches with Vue

Read more about stitches at [@stitches/css](https://github.com/modulz/stitches/tree/master/packages/css).

## Get started

`npm install @stitches/vue-directive`

```tsx
// index.tsx
import Vue from "vue";
import { createCss } from "@stitches/css";

const css = createCss({
  screens: {
    sm: (cssRule) => `@media (min-width: 768px) { ${cssRule} }`,
    md: (cssRule) => `@media (min-width: 1024px) { ${cssRule} }`,
  },
  tokens: {
    colors: {
      "red-primary": "red",
    },
    space: {
      0: "0",
      1: "1rem",
      2: "2rem",
    },
  },
});

Vue.directive("css", css);
```

```html
<template>
  <div id="app">
    <img width="25%" src="./assets/logo.png" />
    <h1 v-css:sm="'margin-1'" v-css:md="'margin-2'">By screen</h1>
    <h1 v-css="'color-red-primary'">Static</h1>
    <h1
      v-css="{
      'hover:background-color-red-primary': makeRedOnHover
    }"
    >
      Dynamic
    </h1>
  </div>
</template>
```
