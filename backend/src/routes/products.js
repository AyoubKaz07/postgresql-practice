const express = require('express');
const router = express.Router();

const { getProduct, updateProduct, deleteProduct } = require('../controllers/Products');

router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;