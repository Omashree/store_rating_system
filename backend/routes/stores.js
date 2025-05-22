const express = require('express');
const router = express.Router();
const stores = require('../controllers/stores');

router.get('/', stores.listStores);
router.post('/', stores.createStore);

module.exports = router;