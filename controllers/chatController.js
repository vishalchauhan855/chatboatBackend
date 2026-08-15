import Chat from '../chatBotModel/model.js';
import groqService from '../services/chatboatservice.js';
import crypto from 'crypto';

export async function sendMessage(req, res) {
    try {
        const { message, chatId } = req.body;
        let chat;

        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
            if (!chat) {
                return res.status(404).json({ error: 'Chat conversation not found.' });
            }
        } else {
            chat = await Chat.create({ userId: req.user._id, messages: [] });
        }

        chat.messages.push({ role: 'user', content: message });

        const aiReply = await groqService.getAIResponse(chat.messages);
        chat.messages.push({ role: 'assistant', content: aiReply });

        await chat.save();

        return res.status(200).json({
            chatId: chat._id,
            reply: aiReply,
            messages: chat.messages
        });
    } catch (error) {
        console.error(`Error in sendMessage: ${error.message}`);
        return res.status(500).json({ error: 'Failed to process message. Please try again.' });
    }
}

export async function getChatHistory(req, res) {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findOne({ _id: chatId, userId: req.user._id });

        if (!chat) {
            return res.status(404).json({ error: 'Chat conversation not found.' });
        }

        return res.status(200).json({
            chatId: chat._id,
            messages: chat.messages
        });
    } catch (error) {
        console.error(`Error in getChatHistory: ${error.message}`);
        return res.status(500).json({ error: 'Failed to retrieve conversation history.' });
    }
}

export async function getChatSessions(req, res) {
    try {
        const chats = await Chat.find({ userId: req.user._id }, { messages: { $slice: 1 }, updatedAt: 1 }).sort({ updatedAt: -1 });
        const sessions = chats.map(chat => {
            const firstMsg = chat.messages[0];
            const title = firstMsg 
                ? (firstMsg.content.substring(0, 30) + (firstMsg.content.length > 30 ? '...' : '')) 
                : 'New Chat';
            return {
                chatId: chat._id,
                title,
                updatedAt: chat.updatedAt
            };
        });
        return res.status(200).json(sessions);
    } catch (error) {
        console.error(`Error in getChatSessions: ${error.message}`);
        return res.status(500).json({ error: 'Failed to retrieve chat sessions.' });
    }
}

export async function shareChat(req, res) {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
        
        if (!chat) {
            return res.status(404).json({ error: 'Chat conversation not found.' });
        }

        if (!chat.shareId) {
            chat.isShared = true;
            chat.shareId = crypto.randomUUID();
            await chat.save();
        }

        return res.status(200).json({ shareId: chat.shareId });
    } catch (error) {
        console.error(`Error in shareChat: ${error.message}`);
        return res.status(500).json({ error: 'Failed to generate sharing link.' });
    }
}

export async function getSharedChatHistory(req, res) {
    try {
        const { shareId } = req.params;
        const chat = await Chat.findOne({ shareId, isShared: true });

        if (!chat) {
            return res.status(404).json({ error: 'Shared conversation not found or link has expired.' });
        }

        return res.status(200).json({
            messages: chat.messages
        });
    } catch (error) {
        console.error(`Error in getSharedChatHistory: ${error.message}`);
        return res.status(500).json({ error: 'Failed to retrieve shared conversation.' });
    }
}