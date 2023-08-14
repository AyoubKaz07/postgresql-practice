const express = require('express');
const router = express.Router();

const { finalizeOrder } = require('../controllers/Orders');


router.post('/finalizeorder', finalizeOrder);


module.exports = router;