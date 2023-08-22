const express = require('express');
const router = express.Router();

const { getOrders, finalizeOrder, getOrder, getCustomerOrders, paymentDetails, startCheckout } = require('../controllers/Orders');


router.get('/allorders', getOrders);
router.get('/myOrders', getCustomerOrders);
router.route('/finalizeorder').get(finalizeOrder);
router.route('/:order_id').get(getOrder);
router.get('/paymentdetails/:order_id', paymentDetails);
router.post('/checkout', startCheckout);


module.exports = router;