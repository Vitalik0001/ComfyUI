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
    const files = req.files;

    if (!files || !files.image1 || !files.image2) {
      return res.status(400).json({ error: 'Both images are required' });
    }

    const requestId = uuidv4();
    req.requestId = requestId;

    const routeName = req.baseUrl.split('/').pop();
    const targetFolder = helpers.getTargetFolder(UPLOADED_IMAGES_FOLDER_PATH, routeName);
    req.targetFolder = targetFolder;
    
    await fs.mkdir(targetFolder, { recursive: true });

    const file1 = files.image1[0];
    const filename1 = helpers.generateFilename(file1.originalname, imageProcessingConfig.fileExtension, requestId, 'image-1');
    const filepath1 = path.join(targetFolder, filename1);
    const processedBuffer1 = await processImage(file1.buffer);
    await fs.writeFile(filepath1, processedBuffer1);

    const file2 = files.image2[0];
    const filename2 = helpers.generateFilename(file2.originalname, imageProcessingConfig.fileExtension, requestId, 'image-2');
    const filepath2 = path.join(targetFolder, filename2);
    const processedBuffer2 = await processImage(file2.buffer);
    await fs.writeFile(filepath2, processedBuffer2);

    req.processedFiles = {
      image1: {
        ...file1,
        path: filepath1,
        filename: filename1,
        mimetype: imageProcessingConfig.mimeType,
        size: processedBuffer1.length,
        buffer: processedBuffer1
      },
      image2: {
        ...file2,
        path: filepath2,
        filename: filename2,
        mimetype: imageProcessingConfig.mimeType,
        size: processedBuffer2.length,
        buffer: processedBuffer2
      }
    };

    next();
  } catch (error) {
    console.error('Image pre-processing failed:', error);
    return res.status(500).json({ error: 'Image processing failed' });
  }
};
