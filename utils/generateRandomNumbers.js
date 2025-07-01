/**
 * Generates a random numeric string of the given length.
 *
 * @param {number} length - The length of the string to generate.
 * @returns {string} A random numeric string.
 * @throws {Error} If the length is not a positive integer.
 */

export const generateRandomNumbers = (length) => {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Length must be a positive integer');
  }

  const digits = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return result;
};
