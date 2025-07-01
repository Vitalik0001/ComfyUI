import path from 'path';
import fs from 'fs/promises';
import mime from 'mime-types';
import { Readable } from 'stream';

import imageProcessingConfig from '../../../config/imageProcessingConfig.js';

import { ComfyWebSocketHandler } from '../../../shared/services/comfyWebSocketHandler.js';

import promptDataBuilder from '../services/promptDataBuilder.js'
import { processImage } from '../services/imageService.js';

import { helpers } from '../../../utils/index.js';

export const uploadImageAndGenerate = async (req, res) => {
  try {
    const files = req.processedFiles;

    if (!files || !files.image1 || !files.image2) {
      return res.status(400).json({ error: 'Both images are required' });
    }

    const prompt = req.body.prompt;
    const requestId = req.requestId;
    console.log('[uploadImageAndGenerate] Starting process for prompt:', prompt);

    const handler = new ComfyWebSocketHandler(promptDataBuilder);

    const result = await handler.sendPrompt(prompt, {
      firstImageName: files.image1.filename,
      secondImageName: files.image2.filename
    });

    console.log('[uploadImageAndGenerate] Prompt result:', result);

    await handler.getLastImage();
    const imageBuffer = await handler.getImage();

    if (!imageBuffer) {
      return res.status(500).json({ error: 'No image buffer received' });
    }

    const processedImageBuffer = await processImage(imageBuffer);

    const targetFolder = req.targetFolder;

    const resultFilename = helpers.generateFilename('result.jpg', imageProcessingConfig.fileExtension, requestId, 'result');
    const resultPath = path.join(targetFolder, resultFilename);
    await fs.writeFile(resultPath, processedImageBuffer);

    const mimeType = mime.lookup('jpg') || 'image/jpeg';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', processedImageBuffer.length);

    const stream = Readable.from(processedImageBuffer);
    stream.pipe(res);
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({ error: 'Failed to process image' });
  }
};
