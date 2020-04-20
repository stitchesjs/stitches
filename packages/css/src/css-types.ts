import {
  StandardLonghandProperties,
  StandardShorthandProperties,
} from "csstype";

export type AllCssProps = Required<
  StandardLonghandProperties & StandardShorthandProperties
>;
