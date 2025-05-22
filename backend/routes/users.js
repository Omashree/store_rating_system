const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const { authenticateJWT } = require('../middleware/auth');

router.get('/', users.listUsers);
router.post('/', users.createUser);
router.put('/update-password', authenticateJWT, users.updatePassword);

module.exports = router;