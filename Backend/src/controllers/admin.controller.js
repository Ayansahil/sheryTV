const User = require('../models/user.model');
const Favorite = require('../models/favorite.model');
const History = require('../models/history.model');

// GET all users
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (err) { next(err); }
};

// BAN user
const banUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(403).json({ message: 'Cannot ban admin' });

        user.isBanned = !user.isBanned;
        await user.save();
        res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, user });
    } catch (err) { next(err); }
};

// DELETE user
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });

        await User.findByIdAndDelete(req.params.id);
        await Favorite.deleteMany({ user: req.params.id });
        await History.deleteMany({ user: req.params.id });

        res.json({ success: true, message: 'User deleted' });
    } catch (err) { next(err); }
};

// GET stats
const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const bannedUsers = await User.countDocuments({ isBanned: true });
        const totalFavorites = await Favorite.countDocuments();
        const totalHistory = await History.countDocuments();
        const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

        res.json({ success: true, stats: { totalUsers, bannedUsers, totalFavorites, totalHistory, recentUsers } });
    } catch (err) { next(err); }
};

module.exports = { getUsers, banUser, deleteUser, getStats };