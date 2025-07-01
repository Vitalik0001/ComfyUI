import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

// Middleware
import errorHandler from './middlewares/errorHandler.js';

// Routes
import sketchToRenderAiRoutes from './modules/sketchToRenderAi/routes/sketchToRenderRoutes.js';
import aiInteriorDesignerRoutes from './modules/aiInteriorDesigner/routes/interiorDesignerRoutes.js';

// Controllers
import debugController from './shared/controllers/debugController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ROOT_PROJECT_FOLDER_PATH = process.env.ROOT_PROJECT_FOLDER_PATH;

app.use(cors());
app.use(express.json());

/** Root - redirect or serve a menu */
app.use(express.static(path.join(ROOT_PROJECT_FOLDER_PATH, 'public')));

/** Static Apps */
app.use('/sketch-to-render-ai', express.static(path.join(ROOT_PROJECT_FOLDER_PATH, 'public/apps/sketch-to-render-ai')));
app.use('/ai-interior-designer', express.static(path.join(ROOT_PROJECT_FOLDER_PATH, 'public/apps/ai-interior-designer')));

/** API Routes */
app.use('/api/sketch-to-render-ai', sketchToRenderAiRoutes);
app.use('/api/ai-interior-designer', aiInteriorDesignerRoutes);

/** Debug endpoint */
app.get('/api/debug', debugController);

/** Global error handler */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
