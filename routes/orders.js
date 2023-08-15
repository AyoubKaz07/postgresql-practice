const express = require('express');
const router = express.Router();

const { finalizeOrder, getOrder, getOrders } = require('../controllers/Orders');


router.post('/finalizeorder', finalizeOrder);
router.get('/orders', getOrders);
router.get('/orders/:order_id', getOrder);


module.exports = router;