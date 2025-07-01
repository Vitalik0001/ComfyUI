import sharp from 'sharp';
import imageProcessingConfig from '../../../config/imageProcessingConfig.js';

export const processImage = async (buffer) => {
  return await sharp(buffer)
    .rotate()
    .resize(imageProcessingConfig.resize)
    .toFormat(imageProcessingConfig.outputFormat, { quality: imageProcessingConfig.jpegQuality })
    .withMetadata()
    .toBuffer();
};
