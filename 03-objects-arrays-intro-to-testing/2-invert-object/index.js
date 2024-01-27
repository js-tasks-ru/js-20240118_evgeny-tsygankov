/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (!obj) {
    return;
  }

  const resultObject = {};

  for (const key in obj) {
    const newKey = obj[key];
    const newValue = key;

    resultObject[newKey] = newValue;
  }
  return resultObject;
}
