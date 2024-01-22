/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!Boolean(size)) {
    return size === 0 ? "" : string;
  }

  let resultString = "";
  let counter = 1;

  for (let i = 0; i <= string.length - 1; i++) {
    const prevChar = string[i - 1];
    const currentChar = string[i];

    if (prevChar === currentChar) {
      if (counter < size) {
        resultString += currentChar;
        counter += 1;
      }
    } else {
      resultString += currentChar;
      counter = 1;
    }
  }

  return resultString;
}
