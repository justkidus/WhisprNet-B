const jwt = require('jsonwebtoken');
const generateToken = async (userId, res) => {
	const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
		expiresIn: '30d',
	});
	res.cookie('jwt', token, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true, //prevent XSS attaks cross-site scirpting attacks
		// sameSite: 'strict', //CSRF attacks cross-site request forgery attacks
		sameSite: 'None',
		// secure: process.env.NODE_ENV !== 'development',
		secure: true,
	});
	return token;
};

module.exports = { generateToken };
