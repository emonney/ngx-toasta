
/**
 * Check and return true if an object is type of string
 * @param obj Analyse has to object the string type
 * @return result of analysis
 */
export function isString(obj: any): boolean {
  return typeof obj === 'string';
}

/**
 * Check and return true if an object is type of number
 * @param obj Analyse has to object the boolean type
 * @return result of analysis
 */
export function isNumber(obj: any): boolean {
  return typeof obj === 'number';
}

/**
 * Check and return true if an object is type of Function
 * @param obj Analyse has to object the function type
 * @return result of analysis
 */
export function isFunction(obj: any): boolean {
  return typeof obj === 'function';
}
