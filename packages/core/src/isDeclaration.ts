import Object from './Object'

/** Returns whether the current source contains a declaration. */
const isDeclaration = (value: any): value is number | string => value !== Object(value) || !(value.constructor === Object || value.constructor == null)

export default isDeclaration
