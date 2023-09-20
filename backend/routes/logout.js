const express = require('express');
const router = express.Router();
const logout = require('../controllers/logout');

router.get('/', logout.handleLogout);

module.exports = router;