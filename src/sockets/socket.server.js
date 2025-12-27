const { Server } = require("socket.io");
const chatModel = require("../models/chat.model");
const { getAIChatResponse } = require("../services/ai.service");

module.exports = (server) => {
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        // Load old chat on demand
        socket.on("load_history", async (data) => {
            try {
                // 'data' variable ko check karein aur userId extract karein
                const id = typeof data === 'object' ? data.userId : data;
        
                if (!id) return console.error("No userId provided for history");
        
                const chat = await chatModel.findOne({ userId: id });
                socket.emit("chat_history", chat ? chat.messages : []);
            } catch (err) {
                console.error("Socket History Error:", err.message);
            }
        });

        socket.on("send_msg", async ({ userId, text }) => {
            // 1. Get history for context
            let chat = await chatModel.findOne({ userId });
            const history = chat ? chat.messages : [];

            // 2. Save User Message
            chat = await chatModel.findOneAndUpdate(
                { userId },
                { $push: { messages: { role: 'user', content: text } } },
                { upsert: true, new: true }
            );

            // 3. Get AI Response
            const aiText = await getAIChatResponse(text, history);

            // 4. Save AI Response
            await chatModel.findOneAndUpdate(
                { userId },
                { $push: { messages: { role: 'assistant', content: aiText } } }
            );

            // 5. Send back to client
            socket.emit("receive_msg", { role: 'assistant', content: aiText });
        });
    });
};