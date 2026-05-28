import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js'; // ← {} lagao

const router = express.Router();

router.post('/send', sendMessage);
router.get('/history/:chatId', getChatHistory);

export default router;