export const getStackTail = () => (new Error().stack.match(/\/[^/:]+:\d+:/g) || []).slice(0, -1)
