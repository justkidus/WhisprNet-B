const { GroupMessage } = require('../models/group.Message.model');
const { getGroupSocketId, io, getReceiverSocketId } = require('../lib/socket');
const getGroupMessage = async (req, res) => {
	try {
		const { groupId: groupId } = req.params; //so for me to this work i have to make it groupId instead if id
		const groupMessage = await GroupMessage.find({ groupId }).sort({
			createdAt: 1,
		});

		res.status(200).json(groupMessage);
	} catch (error) {
		console.log('error at the get group messages');
		res.status(500).json('Intenal server error');
	}
};

const sendMessageToGroup = async (req, res) => {
	try {
		const { text, image } = req.body;
		const senderId = req.user._id;
		const { groupId } = req.params;
		let imageUrl;

		if (image) {
			//upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}
		const newGroupMessage = new GroupMessage({
			senderId,
			groupId,
			text,
			image: imageUrl,
		});
		await newGroupMessage.save();
		io.to(groupId).emit('newGroupMessage', newGroupMessage);
		res.status(201).json(newGroupMessage);
	} catch (error) {
		console.log('error at the send group messages');
		res.status(500).json('Intenal server error');
	}
};

module.exports = { getGroupMessage, sendMessageToGroup };
