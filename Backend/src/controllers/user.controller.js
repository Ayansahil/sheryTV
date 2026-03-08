const User = require('../models/user.model');
const imagekit = require('../config/imagekit');
const bcrypt = require('bcryptjs');

// GET profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, user });
    } catch (err) { next(err); }
};

// UPDATE profile (name + avatar)
const updateProfile = async (req, res, next) => {
    try {
        const { name, imageBase64, avatar, fileName } = req.body;
        const image = imageBase64 || avatar;
        const user = await User.findById(req.user._id);

        if (name) user.name = name;

        // Avatar upload to ImageKit
        if (image) {
            // Purana avatar delete karo ImageKit se
            if (user.avatarFileId) {
                try {
                    await imagekit.deleteFile(user.avatarFileId);
                } catch (e) {
                    console.log('Old avatar delete failed:', e.message);
                }
            }

            // Naya upload
            const uploaded = await imagekit.upload({
                file: image,
                fileName: fileName || `avatar_${user._id}`,
                folder: '/avatars',
            });

            user.avatar = uploaded.url;
            user.avatarFileId = uploaded.fileId;
        }

        await user.save();
        const updated = await User.findById(user._id).select('-password');
        res.json({ success: true, user: updated });
    } catch (err) { next(err); }
};

// CHANGE password
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password galat hai' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: 'Password change ho gaya!' });
    } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, changePassword };