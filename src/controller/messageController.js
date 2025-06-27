const User = require('../models/user.models');
const { Message } = require('../models/message.model');
const { getReceiverSocketId, io } = require('../lib/socket');
const { cloudinary } = require('../lib/cloudinary');

const getAllUsers = async (req, res) => {
	try {
		const loggedUser = req.user._id;
		console.log('loggedUser ', loggedUser);
		const filteredUsers = await User.find({
			_id: { $ne: loggedUser }, //tells the mongoose to fetch all the users other than the user
		}).select('-password'); // this tells mongoose to fetch user without the user password
		res.status(200).json(filteredUsers);
	} catch (error) {
		console.log('error in getAlluser', error.message);
		return res.status(400).json({ msg: 'error in message controller' });
	}
};

const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params; //this line use to get id from the clicked user and when it gets the id from the URL
		const myId = req.user._id;
		const messages = await Message.find({
			$or: [
				// this is needed because we only wanted to the messages between these users only
				// this or says Find documents that match at least one of the conditions in this array.
				{ senderId: myId, receiverId: userToChatId },
				{ senderId: userToChatId, receiverId: myId },
			], // this code You're searching the Message collection for any message that matches either of these conditions:
		});
		res.status(200).json(messages);
	} catch (error) {
		console.log('error in get messages', error.msg);
		res.status(500).json({ error: 'Internal server error' });
	}
};
const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;
		let imageUrl;

		if (image) {
			// upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});
		await newMessage.save();
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit('newMessage', newMessage);
		}
		res.status(201).json(newMessage);
		console.log('message sent successfully');
	} catch (error) {
		console.log('❌ Error in send messages:', error.msg);
		console.error(error); // <-- shows full Cloudinary error

		res.status(500).json('internal server error');
	}
};

module.exports = { getAllUsers, getMessages, sendMessage };
