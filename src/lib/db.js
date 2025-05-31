const mongoose = require('mongoose');

const connectDb = async (req, res) => {
	try {
		await mongoose.connect(process.env.MONGODB);
		console.log('mongodb connected successfuly');
	} catch (error) {
		throw error;
	}
};
module.exports = { connectDb };
