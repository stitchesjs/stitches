import Object from './Object.js'

/** Returns whether the current source contains a declaration. */
const isDeclaration = (value) => value !== Object(value) || !(value.constructor === Object || value.constructor == null)

export default isDeclaration
