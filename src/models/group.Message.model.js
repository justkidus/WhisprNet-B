const mongoose = require('mongoose');

const groupmessageSchema = new mongoose.Schema(
	{
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
			required: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		// groupUsers:{
		// 	type
		// 		required: true,
		// },
		text: {
			type: String,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);
const GroupMessage = mongoose.model('GroupMessage', groupmessageSchema);
module.exports = { GroupMessage };
