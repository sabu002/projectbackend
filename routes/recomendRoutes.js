// server/routes/recomendRoutes.js
import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';


const router = express.Router();

router.get("/recommend/:userId",getRecommendations );

export default router;
