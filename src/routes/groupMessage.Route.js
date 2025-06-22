const express = require('express');
const {
	getGroupMessage,
	sendMessageToGroup,
} = require('../controller/groupMessage.controller');
const { protectRoute } = require('../middleware/authmiddleware');
const groupmessageRouter = express.Router();

groupmessageRouter.get(
	'/getgroupmessage/:groupId',
	protectRoute,
	getGroupMessage
);
groupmessageRouter.post('/send/:groupId', protectRoute, sendMessageToGroup);

module.exports = { groupmessageRouter };
