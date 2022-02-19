/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  if (size === 0) {
    return "";
  }

  let currentSym = string[0];
  let counter = 0;

  return string.split("").reduce((accum, sym) => {
    if (currentSym === sym) {
      if (counter < size) {
        counter++;
      } else {
        return accum;
      }
    } else {
      currentSym = sym;
      counter = 1;
    }

    return accum + sym;
  }, "");
}
