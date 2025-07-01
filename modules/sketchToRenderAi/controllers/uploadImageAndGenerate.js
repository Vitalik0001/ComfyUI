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
        
        if (!file) return res.status(400).json({ error: 'No file uploaded' });
        
        const prompt = req.body.prompt;
        const requestId = req.requestId;
        console.log('[uploadImageAndGenerate] Starting process for prompt:', prompt);

        const handler = new ComfyWebSocketHandler(promptDataBuilder);

        const result = await handler.sendPrompt(prompt, file.filename);
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
