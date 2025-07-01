import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique filename by prefixing a UUID or a custom prefix and sanitizing the original filename.
 * Spaces in the base name are replaced with underscores to ensure filesystem compatibility.
 * The file extension can be optionally overridden; otherwise, the original extension is preserved.
 *
 * @param {string} originalname - The original filename, including its extension (e.g., "my photo.png").
 * @param {string} [ext] - Optional. The file extension to use for the generated filename.
 *                         If omitted, the original file extension will be used.
 * @param {string} [prefix] - Optional. Custom prefix (e.g., shared request ID) to prepend instead of generating a UUID.
 *                            If not provided, a new UUID is generated.
 * @param {number|string} [index] - Optional. Index or flag to append for distinguishing multiple files with the same prefix.
 *
 * @returns {string} A unique filename in the format: `{prefixOrUuid}-{index?}-{sanitizedName}{ext}`.
 *
 * @example
 * generateFilename("summer vacation.png");
 * // Returns: "550e8400-e29b-41d4-a716-446655440000-summer_vacation.png"
 *
 * generateFilename("document.pdf", ".txt", "myRequestId", 1);
 * // Returns: "myRequestId-1-document.txt"
 */

export const generateFilename = (originalname, ext, prefix, index) => {
  const id = prefix || uuidv4();
  const originalExt = path.extname(originalname);
  const extension = ext ?? originalExt ?? '.jpg';
  const name = path.basename(originalname, originalExt).replace(/\s/g, '_');

  const indexPart = (index !== undefined && index !== null) ? `-${index}` : '';

  return `${id}${indexPart}-${name}${extension}`;
};
