import Chat from '../chatBotModel/model.js';
import groqService from '../services/chatboatservice.js';

// POST - Message bhejo
export async function sendMessage(req, res) {
    try {
        const { message, chatId } = req.body;

        let chat;

        if (chatId) {
            // Pehle se chal rahi chat
            chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({ error: 'Chat nahi mili' });
            }
        } else {
            // Nayi chat banao
            chat = await Chat.create({ messages: [] });
        }

        // User ka message add karo
        chat.messages.push({ role: 'user', content: message });

        // AI se reply lo
        const aiReply = await groqService.getAIResponse(chat.messages);

        // AI reply add karo
        chat.messages.push({ role: 'assistant', content: aiReply });

        await chat.save();

        res.status(200).json({
            chatId: chat._id,
            reply: aiReply,
            messages: chat.messages
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Server Error' });
    }
}

// GET - Chat history lo
export async function getChatHistory(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ error: 'Chat nahi mili' });
        }

        res.status(200).json({
            chatId: chat._id,
            messages: chat.messages
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Server Error' });
    }
}