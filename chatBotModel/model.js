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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messageSchema],
    isShared: {
        type: Boolean,
        default: false
    },
    shareId: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);