const express = require('express');
const router = express.Router();
const { getUsers, banUser, deleteUser, getStats } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.use(protect, adminOnly); 

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/ban', banUser);
router.delete('/users/:id', deleteUser);

module.exports = router;