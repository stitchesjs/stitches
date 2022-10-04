const { hasOwnProperty } = Object.prototype


export const hasOwn = (target, key) => hasOwnProperty.call(target, key)
