export default Object

export const { assign, create, defineProperties, getOwnPropertyDescriptors } = Object

export const define = (target, append) => defineProperties(target, getOwnPropertyDescriptors(append))
