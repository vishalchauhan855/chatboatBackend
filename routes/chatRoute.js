import express from 'express';
import { sendMessage, getChatHistory, getChatSessions, shareChat, getSharedChatHistory } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to prevent requests from hanging indefinitely
const requestTimeout = (ms) => {
    return (req, res, next) => {
        const timer = setTimeout(() => {
            if (!res.headersSent) {
                res.status(504).json({
                    error: 'Gateway Timeout',
                    message: 'The request took too long to process. Please try again.'
                });
            }
        }, ms);

        // Clear timeout when request is completed or closed
        res.on('finish', () => clearTimeout(timer));
        res.on('close', () => clearTimeout(timer));

        next();
    };
};

// Apply 15 seconds timeout middleware to all chat routes
router.use(requestTimeout(15000));

// Public read-only endpoint (No auth header required)
router.get('/shared/:shareId', getSharedChatHistory);

// Protect all chat routes below this middleware
router.use(authMiddleware);

router.post('/send', sendMessage);
router.post('/share/:chatId', shareChat);
router.get('/sessions', getChatSessions);
router.get('/history/:chatId', getChatHistory);

export default router;