const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const stores = require('../controllers/stores');
const ratings = require('../controllers/ratings');

router.get('/users', users.listUsers);
router.get('/stores', stores.listStores);
router.get('/ratings/count', ratings.getRatingsCount);

module.exports = router;
