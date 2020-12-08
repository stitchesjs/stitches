const define = <T, U>(target: T, source: U): T & U =>
	Object.seal(Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)))

export default define
