import multer from 'multer';
import config from '../config/multerUploadsConfig.js';

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize }
});
