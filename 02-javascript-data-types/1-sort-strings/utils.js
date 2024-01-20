import { LOCALES, COMPARE_OPTIONS, ORDER_BY } from "./constants";

/**
 * sortStrings - sorts array of string by two criteria "asc"
 * @param {string} str1 - first string for comparing
 * @param {string} str2 - first string for comparing
 * @returns {number}
 */
const ascComparator = (str1, str2) =>
  str1.localeCompare(str2, LOCALES, COMPARE_OPTIONS);

/**
 * sortStrings - sorts array of string by two criteria "desc"
 * @param {string} str1 - first string for comparing
 * @param {string} str2 - first string for comparing
 * @returns {number}
 */
const descComparator = (str1, str2) =>
  str2.localeCompare(str1, LOCALES, COMPARE_OPTIONS);

export const compareMap = {
  [ORDER_BY.ASC]: ascComparator,
  [ORDER_BY.DESC]: descComparator,
};
