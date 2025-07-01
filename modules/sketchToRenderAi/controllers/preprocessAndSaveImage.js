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
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const requestId = uuidv4();
    req.requestId = requestId;

    const routeName = req.baseUrl.split('/').pop();
    const targetFolder = helpers.getTargetFolder(UPLOADED_IMAGES_FOLDER_PATH, routeName);
    req.targetFolder = targetFolder;
    
    await fs.mkdir(targetFolder, { recursive: true });

    const filename = helpers.generateFilename(file.originalname, imageProcessingConfig.fileExtension, requestId);
    const filepath = path.join(targetFolder, filename);

    const processedBuffer = await processImage(file.buffer);

    await fs.writeFile(filepath, processedBuffer);

    req.processedFile = {
      ...file,
      path: filepath,
      filename,
      originalname: file.originalname,
      mimetype: imageProcessingConfig.mimeType,
      size: processedBuffer.length,
      buffer: processedBuffer
    };

    next();
  } catch (error) {
    console.error('Image pre-processing failed:', error);
    return res.status(500).json({ error: 'Image processing failed' });
  }
};
