import express from 'express';
import { getBirthChart } from '../controllers/astrologyController.js';

const router = express.Router();

router.post('/chart', getBirthChart);

export default router;
