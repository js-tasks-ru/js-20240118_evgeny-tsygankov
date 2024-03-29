/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) =>
  fields.reduce(
    (resultObject, currentField) => {
      if (currentField in obj) {
        delete resultObject[currentField];
      }
      return resultObject;
    },
    { ...obj }
  );
