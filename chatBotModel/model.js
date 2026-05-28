import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,       // ← fix: typre → type
        required: true,
        enum: ['user', 'assistant']
    },
    content: {
        type: String,
        required: true
    }
});

const chatSchema = new mongoose.Schema({
    messages: [messageSchema]
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);