const express = require('express');
const router = express.Router();

const { finalizeOrder, getOrder, getOrders, usedPayment } = require('../controllers/Orders');


router.post('/finalizeorder', finalizeOrder);
router.get('/', getOrders);
router.get('/:order_id', getOrder);
router.get('/paymentdetails/:order_id', usedPayment);


module.exports = router;