const { Server } = require("socket.io");
const chatModel = require("../models/chat.model");
const userModel = require("../models/user.model");
const { getAIChatResponse } = require("../services/ai.service");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      // Frontend URL env se uthayein, backup ke liye localhost rakhein
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Load old chat on demand
    socket.on("load_history", async (data) => {
      try {
        // 'data' variable ko check karein aur userId extract karein
        const id = typeof data === "object" ? data.userId : data;

        if (!id) return console.error("No userId provided for history");

        const chat = await chatModel.findOne({ userId: id });
        socket.emit("chat_history", chat ? chat.messages : []);
      } catch (err) {
        console.error("Socket History Error:", err.message);
      }
    });

    socket.on("send_msg", async ({ userId, text }) => {
      // 1. Get user's dietary preferences
      const user = await userModel.findById(userId);
      const dietaryPreferences = user?.dietaryPreferences || [];

      // 2. Get history for context
      let chat = await chatModel.findOne({ userId });
      const history = chat ? chat.messages : [];

      // 3. Save User Message
      chat = await chatModel.findOneAndUpdate(
        { userId },
        { $push: { messages: { role: "user", content: text } } },
        { upsert: true, new: true }
      );

      // 4. Get AI Response with dietary preferences
      const aiText = await getAIChatResponse(text, history, dietaryPreferences);

      // 5. Save AI Response
      await chatModel.findOneAndUpdate(
        { userId },
        { $push: { messages: { role: "assistant", content: aiText } } }
      );

      // 6. Send back to client
      socket.emit("receive_msg", { role: "assistant", content: aiText });
    });
  });
};
