import { updateConversationAfterCreateMessage } from "../utils/messageHepper.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const sendDirectMessage = async (req, res) => {
    try {
        const { recipentId, content, conversationId } = req.body;
        const senderId = req.user._id;

        let conversation;

        if (!content) {
            return res.status(400).json({ message: "Message content cannot be empty." });
        }

        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }

        if (!conversation) {
            conversation = await Conversation.create({
                type: 'direct',
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipentId, joinedAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            })
        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
        })

        updateConversationAfterCreateMessage(conversation, message, senderId);
        await conversation.save();

        return res.status(200).json({ message: 'Direct message sent successfully.', conversation });
    } catch (error) {
        console.error('Error sending direct message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const sendGroupMessage = async (req, res) => {
    try {
        const {conversationId, content} = req.body;
        const senderId = req.user._id;
        const conversation = req.conversation;

        if (!content) {
            return res.status(400).json({ message: "Message content cannot be empty." });
        }

        const message = await Message.create({
            conversationId,
            senderId,
            content
        })

        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        return res.status(201).json({ message: 'Group message sent successfully.', conversation });
    } catch (error) {
        console.error('Error sending group message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}