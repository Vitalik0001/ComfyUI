import dotenv from 'dotenv';
import express from 'express';

import { preprocessImage } from '../controllers/preprocessAndSaveImage.js';
import { uploadImageAndGenerate } from '../controllers/uploadImageAndGenerate.js';
import { multerUpload } from '../../../middlewares/multerUpload.js';

dotenv.config();

const router = express.Router();

router.post(
  '/image-upload',
  multerUpload.single('image'),
  preprocessImage,
  uploadImageAndGenerate
);

export default router;
