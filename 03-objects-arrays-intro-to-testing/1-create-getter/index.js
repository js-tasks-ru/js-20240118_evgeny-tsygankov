/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const parsedPath = path.split(".");

  const inner = (obj) => {
    let currentObj = obj;

    for (const key of parsedPath) {
      if (!currentObj.hasOwnProperty(key)) {
        return;
      }

      const value = currentObj[key];

      if (value && typeof value !== "object") {
        return value;
      }

      currentObj = value;
    }
  };

  return inner;
}
