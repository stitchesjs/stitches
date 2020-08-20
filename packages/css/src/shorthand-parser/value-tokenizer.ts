const TOKEN_STRING = 1;
const TOKEN_QUOTED_STRING = 2;
const TOKEN_FUNCTION = 3;
const TOKEN_BRACKET = 4;

type TokenType =
  | typeof TOKEN_STRING
  | typeof TOKEN_QUOTED_STRING
  | typeof TOKEN_FUNCTION
  | typeof TOKEN_BRACKET
  | 0;

let currentType: TokenType;
let currentToken = "";
let currentDepth = 0;
let tokenGroups: string[][] = [[]];

export const tokenizeValue = (str: string) => {
  resetCurrentToken();
  tokenGroups = [[]];
  if (!str) {
    return tokenGroups;
  }
  const strLength = str.length;
  for (let i = 0; i < strLength; i++) {
    const char = str[i];
    switch (char) {
      // whitespace
      case " ":
        if (currentType === TOKEN_STRING) {
          addCurrentTokenToGroup();
        } else if (currentType) {
          currentToken += char;
        }
        break;
      // new token group
      case ",":
        if (!currentDepth) {
          addCurrentTokenToGroup();
          addNewTokenGroup();
        } else {
          currentToken += char;
        }
        break;

      // Quoted string:
      case '"':
        currentToken += char;
        if (!currentDepth && !currentType) {
          currentType = TOKEN_QUOTED_STRING;
          currentDepth = 1;
        } else if (currentDepth === 1 && currentType === TOKEN_QUOTED_STRING) {
          currentDepth = 0;
          addCurrentTokenToGroup();
        }
        break;

      // Css function:
      case "(":
        if (!currentDepth) currentType = TOKEN_FUNCTION;
        currentDepth++;
        currentToken += char;
        break;

      case ")":
        currentToken += char;
        currentDepth--;
        if (currentType === TOKEN_FUNCTION && !currentDepth)
          addCurrentTokenToGroup();
        break;

      // Bracket values:
      case "[":
        if (!currentDepth) currentType = TOKEN_BRACKET;
        currentToken += char;
        currentDepth++;
        break;
      case "]":
        currentToken += char;
        currentDepth--;
        if (!currentDepth) addCurrentTokenToGroup();
        break;

      default:
        if (!currentType) currentType = TOKEN_STRING;
        currentToken += char;
    }
  }
  if (currentToken) addCurrentTokenToGroup();
  return tokenGroups;
};
/**
 * UTILS:
 */

/**
 * Resets the current token info
 */
function resetCurrentToken() {
  currentDepth = currentType = 0;
  currentToken = "";
}
/**
 * Adds current token to the stack then starts a new one
 */
function addCurrentTokenToGroup() {
  if (currentType) tokenGroups[tokenGroups.length - 1].push(currentToken);
  resetCurrentToken();
}
/**
 * Adds a new token group and requests a new one
 * For things like animations or box shadow where there might be multiple rules
 * applied to the same value
 */
function addNewTokenGroup() {
  tokenGroups[tokenGroups.length] = [];
  resetCurrentToken();
}
