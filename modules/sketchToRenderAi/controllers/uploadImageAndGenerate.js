import path from 'path';
import fs from 'fs/promises';
import mime from 'mime-types';
import { Readable } from 'stream';

import { helpers } from '../../../utils/index.js';

import imageProcessingConfig from '../../../config/imageProcessingConfig.js';

import { ComfyWebSocketHandler } from '../../../shared/services/comfyWebSocketHandler.js';

import promptDataBuilder from '../services/promptDataBuilder.js'
import { processImage } from '../services/imageService.js';

export const uploadImageAndGenerate = async (req, res) => {
    try {
        const file = req.processedFile;
        console.log('[uploadImageAndGenerate] Received request');

        if (!file) {
            console.error('[uploadImageAndGenerate] No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const prompt = req.body.prompt;
        const requestId = req.requestId;
        console.log(`[uploadImageAndGenerate] Prompt: ${prompt}, Request ID: ${requestId}`);

        const handler = new ComfyWebSocketHandler(promptDataBuilder);
        console.log('[uploadImageAndGenerate] ComfyWebSocketHandler initialized');

        const result = await handler.sendPrompt(prompt, file.filename);
        console.log('[uploadImageAndGenerate] Prompt sent, received result:', result);

        console.log('[uploadImageAndGenerate] Getting last image');
        await handler.getLastImage();

        console.log('[uploadImageAndGenerate] Fetching image buffer');
        const imageBuffer = await handler.getImage();

        if (!imageBuffer) {
            console.error('[uploadImageAndGenerate] No image buffer received');
            return res.status(500).json({ error: 'No image buffer received' });
        }

        console.log('[uploadImageAndGenerate] Processing image');
        const processedImageBuffer = await processImage(imageBuffer);

        const targetFolder = req.targetFolder;
        console.log(`[uploadImageAndGenerate] Target folder: ${targetFolder}`);

        const resultFilename = helpers.generateFilename('result.jpg', imageProcessingConfig.fileExtension, requestId, 'result');
        const resultPath = path.join(targetFolder, resultFilename);
        console.log(`[uploadImageAndGenerate] Saving result image to: ${resultPath}`);

        await fs.writeFile(resultPath, processedImageBuffer);

        const mimeType = mime.lookup('jpg') || 'image/jpeg';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', processedImageBuffer.length);

        console.log('[uploadImageAndGenerate] Sending image to client');
        const stream = Readable.from(processedImageBuffer);
        stream.pipe(res);
    } catch (error) {
        console.error('[uploadImageAndGenerate] Error processing image:', error);
        return res.status(500).json({ error: 'Failed to process image', details: error.message });
    }
};
