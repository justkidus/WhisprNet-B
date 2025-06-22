const express = require('express');
const { Group } = require('../models/group.model');

const createGroup = async (req, res) => {
	const { name, members = [] } = req.body;
	if (!name) {
		return res.status(400).json('group name needed');
	}

	try {
		const groupname = await Group.findOne({ name });
		if (groupname) {
			return res.status(400).json('group name alread used');
		}
		const uniqueMembers = [...new Set([req.user._id, ...members])];

		const newGroup = new Group({
			name,
			admin: req.user._id,
			members: uniqueMembers, // creator should be a member too
		});

		await newGroup.save();

		res.status(201).json({
			_id: newGroup._id,
			name: newGroup.name,
			admin: newGroup.admin,
			members: newGroup.members,
			profilePic: newGroup.profilePic,
		});
	} catch (error) {
		console.log('error in create group', error.msg);
		res.status(500).json('error at group controller');
	}
};

const addMembers = async (req, res) => {
	const { groupId } = req.params;
	const { members } = req.body;
	if (!members || !groupId || members.length === 0) {
		res.status(400).json({ msg: 'both members and groupId are required' });
	}
	try {
		const add = await Group.findByIdAndUpdate(
			groupId,
			{ $addToSet: { members: { $each: members } } },
			{ new: true }
		);
		if (!add) {
			return res.status(404).json({ message: 'Group not found' });
		}

		return res.status(200).json(add);
	} catch (error) {
		console.log('error at add members', error.msg);
		res.status(500).json('Internal server error');
	}
};
const removeMember = async (req, res) => {
	const { groupId } = req.params;
	const { memberId } = req.body;

	// if (!memberId) {
	// 	return res.status(400).json({ msg: 'Member ID is required' });
	// }
	try {
		const updatedGroup = await Group.findByIdAndUpdate(
			groupId,
			{ $pull: { members: memberId } },
			{ new: true }
		);
		if (!updatedGroup) {
			return res.status(404).json({ msg: 'Group not found' });
		}
		res.status(200).json(updatedGroup);
	} catch (error) {
		console.log('error in remove member');
		res.status(500).json('Internal server error');
	}
};
const removeGroup = async (req, res) => {
	const { groupId } = req.params;

	try {
		const removeGroup = await Group.findByIdAndDelete(groupId);
		res.status(200).json(removeGroup);
	} catch (error) {
		console.log('error in remove group', error.msg);
		res.status(500).json('Internal server error');
	}
};

const getAllGroups = async (req, res) => {
	try {
		const getAllGroup = await Group.find();
		res.status(200).json(getAllGroup);
	} catch (error) {
		console.log("error in get all group's", error.msg);
		res.status(500).json('internal server error');
	}
};
const getGroupMember = async (req, res) => {
	const userId = req.user._id;
	try {
		const fetchMembers = await Group.find({
			$or: [{ admin: userId }, { members: userId }],
		}).populate('admin members');
		res.json(fetchMembers);
	} catch (error) {
		res.status(500).json('internal server error');
	}
};
module.exports = {
	createGroup,
	addMembers,
	removeMember,
	removeGroup,
	getAllGroups,
	getGroupMember,
};
