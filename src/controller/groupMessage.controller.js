const { GroupMessage } = require('../models/group.Message.model');

const getGroupMessage = async (req, res) => {
	try {
		const { groupId } = req.params;
		const myId = req.user._id;

		const groupMessage = await GroupMessage.find({
			groupId,
			senderId: myId,
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
		const newMessage = new GroupMessage({
			senderId,
			groupId,
			text,
			image: imageUrl,
		});
		await newMessage.save();

		res.status(201).json(newMessage);
	} catch (error) {
		console.log('error at the send group messages');
		res.status(500).json('Intenal server error');
	}
};
module.exports = { getGroupMessage, sendMessageToGroup };
