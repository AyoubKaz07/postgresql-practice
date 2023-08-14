const express = require('express');
const router = express.Router();

const { getProduct } = require('../controllers/Products');

router.route('/:name').get(getProduct);

module.exports = router;