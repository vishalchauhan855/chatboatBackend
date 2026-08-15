import express from 'express';
import { signupUser, loginUser, getCurrentUser, updateUser, deleteUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.patch('/update', authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);

export default router;
