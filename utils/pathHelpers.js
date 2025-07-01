import path from 'path';

/**
 * Helper function to generate a target folder path based on a base path and route name.
 *
 * @param {string} basePath - The base directory path (e.g., the root of uploaded files).
 * @param {string} routeName - The name of the route or category, used as a subfolder.
 * @returns {string} The full path to the target folder.
 *
 * @example
 * const folderPath = getTargetFolder('/uploads', 'images');
 * console.log(folderPath); // /uploads/images
 */

export const getTargetFolder = (basePath, routeName) => path.join(basePath, routeName);
