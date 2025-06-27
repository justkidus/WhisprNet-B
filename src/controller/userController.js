const { generateToken } = require('../lib/utilil');
const User = require('../models/user.models');
const bcrypt = require('bcryptjs');
const { cloudinary } = require('../lib/cloudinary');
// when you use nodeDefault it doesn't need exports
const signUp = async (req, res) => {
	const { fullName, email, password } = req.body;

	try {
		if (!fullName || !email || !password) {
			return res.status(400).json({ msg: 'All field are necessary' });
		}
		if (password.length < 6) {
			return res
				.status(400)
				.json({ msg: 'password must be at least 6 characters' });
		}
		const user = await User.findOne({ email });
		const userByName = await User.findOne({ fullName });
		if (userByName) {
			return res.status(400).json({ msg: 'name already exists' });
		}
		if (user) {
			return res.status(400).json({ msg: 'email already exists' });
		}
		const hash = await bcrypt.hash(password, 10);
		const newUser = new User({
			fullName,
			email,
			password: hash,
		});
		if (newUser) {
			generateToken(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ message: 'Invalid user data' });
		}
	} catch (error) {
		console.log('error in register', error);
		res.status(500).json({ msg: 'Internal server error' });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ msg: 'All fields are necessary ' });
	}
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ msg: 'Invalid credentials' });
		}
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ msg: 'Invalid credentials' });
		}
		generateToken(user._id, res);
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			prodilePic: user.profilePic,
		});
	} catch (error) {
		console.log('error in login ', error);
		return res.status(500).json({ msg: 'Internal server error' });
	}
};
const logout = async (req, res) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 });
		res.status(200).json({ msg: 'user Logged out successfuly' });
		console.log('user logged out successfuly');
	} catch (error) {
		console.log('error in log out', error);
		res.status(500).json({ msg: 'internal server errors' });
	}
};
const updateProfile = async (req, res) => {
	try {
		const { fullName } = req.body;
		const { profilePic } = req.body;

		const userId = req.user._id;
		const updateData = {};
		if (fullName) updateData.fullName = fullName;

		if (profilePic) {
			const uploadResponse = await cloudinary.uploader.upload(profilePic, {
				folder: 'profile_pics',
			});
			updateData.profilePic = uploadResponse.secure_url;
		}

		const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
			new: true,
		});
		return res.status(200).json({ updatedUser });
	} catch (error) {
		console.log('error in update Profile', error);
		return res.status(500).json({ msg: 'internal server error' });
	}
};

const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
		console.log('user is autheniticated', req.user);
	} catch (error) {
		console.log('error in check auth');
		res.status(500).json({ msg: 'Internal server error' });
	}
};
module.exports = { signUp, login, logout, checkAuth, updateProfile };
