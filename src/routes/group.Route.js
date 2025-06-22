const express = require('express');

const { protectRoute, verifyAdmin } = require('../middleware/authmiddleware');
const {
	createGroup,
	addMembers,
	removeMember,
	removeGroup,
	getAllGroups,
	getGroupMember,
} = require('../controller/group.controller');

const grouprouter = express.Router();

grouprouter.post('/creategroup', protectRoute, createGroup);
grouprouter.post('/:groupId/addmembers', protectRoute, addMembers);
grouprouter.put('/:groupId/removemembers', protectRoute, removeMember);
grouprouter.delete('/:groupId/removeGroup', protectRoute, removeGroup);
grouprouter.get('/getAllGroups', protectRoute, getAllGroups);
grouprouter.get('/getAllGroupsMembers', protectRoute, getGroupMember);
module.exports = { grouprouter };
