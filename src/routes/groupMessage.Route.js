const express = require('express');
const {
	getGroupMessage,
	sendMessageToGroup,
} = require('../controller/groupMessage.controller');

const groupmessageRouter = express.Router();

groupmessageRouter.get('/getgroupmessage/:groupId', getGroupMessage);
groupmessageRouter.post('/send/:groupId', sendMessageToGroup);

module.exports = { groupmessageRouter };
