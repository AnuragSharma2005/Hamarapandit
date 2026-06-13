import express from 'express';
import { getSyncData, syncKey, bulkSync } from '../controllers/syncController.js';
import { protectOptional } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectOptional, getSyncData);
router.post('/bulk', protectOptional, bulkSync);
router.post('/:key', protectOptional, syncKey);

export default router;
