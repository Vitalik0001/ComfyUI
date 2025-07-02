import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import multerUploadsConfig from '../../../config/multerUploadsConfig.js';
import imageProcessingConfig from '../../../config/imageProcessingConfig.js';

import { helpers } from '../../../utils/index.js';

import { processImage } from '../services/imageService.js';

const UPLOADED_IMAGES_FOLDER_PATH = multerUploadsConfig.folderPath;

export const preprocessImage = async (req, res, next) => {
  try {
    console.log('[preprocessImage] Start processing uploaded image');

    const file = req.file;
    if (!file) {
      console.error('[preprocessImage] No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('[preprocessImage] File received:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const requestId = uuidv4();
    req.requestId = requestId;
    console.log(`[preprocessImage] Generated requestId: ${requestId}`);

    const routeName = req.baseUrl.split('/').pop();
    console.log(`[preprocessImage] Extracted routeName: ${routeName}`);

    const targetFolder = helpers.getTargetFolder(UPLOADED_IMAGES_FOLDER_PATH, routeName);
    req.targetFolder = targetFolder;
    console.log(`[preprocessImage] Target folder resolved to: ${targetFolder}`);

    await fs.mkdir(targetFolder, { recursive: true });
    console.log('[preprocessImage] Ensured target folder exists');

    const filename = helpers.generateFilename(file.originalname, imageProcessingConfig.fileExtension, requestId);
    const filepath = path.join(targetFolder, filename);
    console.log(`[preprocessImage] Output filename: ${filename}`);
    console.log(`[preprocessImage] Full file path: ${filepath}`);

    console.log('[preprocessImage] Starting image processing...');
    const processedBuffer = await processImage(file.buffer);
    console.log('[preprocessImage] Image processing complete');

    await fs.writeFile(filepath, processedBuffer);
    console.log('[preprocessImage] Processed image written to disk');

    req.processedFile = {
      ...file,
      path: filepath,
      filename,
      originalname: file.originalname,
      mimetype: imageProcessingConfig.mimeType,
      size: processedBuffer.length,
      buffer: processedBuffer
    };

    console.log('[preprocessImage] Image metadata set in req.processedFile');
    next();
  } catch (error) {
    console.error('[preprocessImage] Image pre-processing failed:', error);
    return res.status(500).json({ error: 'Image processing failed', details: error.message });
  }
};
