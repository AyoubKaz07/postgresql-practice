const express = require('express');
const router = express.Router();

const { getProducts } = require('../../server/controllers/Products');

router.route('/:category_name').get(getProducts);

module.exports = router;