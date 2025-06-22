const express = require('express');
const {
	signUp,
	login,
	logout,
	updateProfile,
	checkAuth,
} = require('../controller/userController');
const { protectRoute } = require('../middleware/authmiddleware');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', protectRoute, logout);
router.put('/updateprofile', protectRoute, updateProfile);
router.get('/checkauth', protectRoute, checkAuth);

module.exports = { router };
