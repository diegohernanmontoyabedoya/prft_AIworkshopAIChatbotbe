const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { handleChat } = require('../controllers/chatController');

router.post('/', auth, handleChat);

module.exports = router;