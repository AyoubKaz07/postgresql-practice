const express = require('express');
const router = express.Router();

const { addToCart, removeFromCart, updateCart, getCart } = require('../controllers/Carts');


router.post('/add/', addToCart)
router.delete('/remove/:id', removeFromCart)
router.patch('/update/:id', updateCart)
router.get('/getcart/', getCart)

module.exports = router;