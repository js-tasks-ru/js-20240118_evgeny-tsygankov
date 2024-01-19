import { compareMap } from "./utils";

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export const sortStrings = (arr, param = "asc") =>
  [...arr].sort(compareMap[param]);
