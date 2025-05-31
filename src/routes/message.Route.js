const express = require('express');
const {
	getAllUsers,
	getMessages,
	sendMessage,
} = require('../controller/messageController');
const { protectRoute } = require('../middleware/authmiddleware');

const messagerouter = express.Router();

messagerouter.get('/getalluser', protectRoute, getAllUsers);
messagerouter.get('/getmessages/:id', protectRoute, getMessages);
messagerouter.post('/sendmessages/:id', protectRoute, sendMessage);

module.exports = { messagerouter };
