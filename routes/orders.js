const express = require('express');
const router = express.Router();

const { finalizeOrder, getOrder, getOrders, usedPayment, startCheckout } = require('../controllers/Orders');


router.get('/', getOrders);
router.route('/finalizeorder').get(finalizeOrder);
router.route('/:order_id').get(getOrder);
router.get('/paymentdetails/:order_id', usedPayment);
router.post('/checkout', startCheckout);


module.exports = router;