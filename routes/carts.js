const express = require('express');
const router = express.Router();

const { addToCart, removeFromCart, updateCart } = require('../controllers/Carts');


router.post('/add', addToCart)
router.delete('/remove', removeFromCart)
router.patch('/update', updateCart)

module.exports = router;