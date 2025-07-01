import * as generateFilename from './generateFilename.js';
import * as generateRandomNumbers from './generateRandomNumbers.js';
import * as pathHelpers from './pathHelpers.js';

export const helpers = {
  ...generateFilename,
  ...generateRandomNumbers,
  ...pathHelpers,
};
