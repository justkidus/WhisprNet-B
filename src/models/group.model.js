const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		profilePic: {
			type: String,
			default: '',
		},
	},
	{ timestamps: true }
);
const Group = mongoose.model('Group', groupSchema);
module.exports = { Group };
