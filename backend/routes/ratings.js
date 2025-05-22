const express = require('express');
const router = express.Router();
const ratings = require('../controllers/ratings');

router.post('/', ratings.submitRating);
router.get('/user', ratings.getUserRatings);
router.get('/owner', ratings.getStoreRatings);
router.get('/owner/users-rated', ratings.getUsersWhoRatedMyStores);

module.exports = router;