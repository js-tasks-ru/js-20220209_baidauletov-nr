/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
  let arrSort = [...arr];
  const locales = ["ru", "en"];
  const options = {
    sensitivity: "variant",
    caseFirst: "upper",
  };

  if (param === "desc") {
    return arrSort.sort((a, b) => {
      return b.localeCompare(a, locales, options);
    });
  } else {
    return arrSort.sort((a, b) => {
      return a.localeCompare(b, locales, options);
    });
  }
}
