const express = require('express');
const router = express.Router();
const Chat = require('../models/chat.model');
const { authUser } = require('../middlewares/auth.middleware');

router.get('/history', authUser, async (req, res) => {
    const chat = await Chat.findOne({ userId: req.user._id });
    res.json(chat ? chat.messages : []);
});

module.exports = router;