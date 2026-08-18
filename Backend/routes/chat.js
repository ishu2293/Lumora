import express from "express";
import Thread from "../models/Thread.js";
import getApiresponse from "../utils/GroqAi.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all threads for authenticated user
router.get("/thread", authMiddleware, async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// Get messages for specific thread
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId, userId: req.user.id });

        if (!thread) {
            return res.status(404).json({ error: "Chat not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// Delete specific thread
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user.id });

        if (!deletedThread) {
            return res.status(404).json({ error: "Chat not found to delete" });
        }
        res.json({ message: "Thread deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Send message & get AI reply
router.post("/chat", authMiddleware, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }
    try {
        let thread = await Thread.findOne({ threadId, userId: req.user.id });

        if (!thread) {
            thread = new Thread({
                userId: req.user.id,
                threadId,
                title: message.length > 30 ? message.substring(0, 30) + "..." : message,
                messages: [{
                    role: "user",
                    content: message
                }]
            });
        } else {
            thread.messages.push({
                role: "user",
                content: message
            });
        }

        const assistantReply = await getApiresponse(message);
        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.error("Chat API Error:", err);
        res.status(500).json({ error: err.message || "Something went wrong processing your request." });
    }
});

export default router;