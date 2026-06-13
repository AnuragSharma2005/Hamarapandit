import express from 'express';
import { registerUser, loginUser, getUserProfile, getAstrologers, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/astrologers', getAstrologers);

export default router;
