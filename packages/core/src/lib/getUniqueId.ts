const getUniqueId = () => `u${Math.floor(Math.random() * (9 ** 12 - 9 ** 9 + 1) + 9 ** 9).toString(16)}`

export default getUniqueId
