const jwt = require('jsonwebtoken');
const User = require('../models/user.models');

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({
				msg: 'unauthorized - no token found',
			});
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		if (!decoded) {
			return res.status(401).json({ msg: 'unauthorized -invalid token' });
		}

		const user = await User.findById(decoded.userId).select('-password');
		if (!user) {
			return res.status(404).json({ msg: 'user is not found' });
		}
		req.user = user;
		next();
	} catch (error) {
		console.log('error in login controller', error.msg);
		res.status(500).json({ msg: 'Internal server error' });
	}
};

const verifyAdmin = async (req, res) => {
	try {
		if (req.user._id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			return next(createError(403, 'you are not user or admin'));
		}
	} catch (error) {
		console.log('error in login controller', error.msg);
		res.status(500).json({ msg: 'internal server error' });
	}
};
module.exports = { protectRoute, verifyAdmin };
