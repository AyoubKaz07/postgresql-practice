const express = require('express');
const router = express.Router();

const pool = require('../db/dbconfig');


router.post('/add', (req, res) => {
    const { product_id, quantity }  = req.body;
    // temporary
    const sessionId = 5;
    pool.query('SELECT add_to_cart($1, $2, $3)', [sessionId, product_id, quantity], (error, result) => {
        if (error) throw error;
        res.send('Product added to cart');
    })
})

router.post('/remove', (req, res) => {
    const { product_id } = req.body;
    // temporary
    const sessionId = 5;
    pool.query('SELECT remove_from_cart($1, $2)', [sessionId, product_id], (error, result) => {
        if (error) throw error;
        res.send('Product removed from cart');
    })
})

router.patch('/update', (req, res) => {
    const { product_id, quantity } = req.body;
    // temporary
    const sessionId = 5;
    pool.query('SELECT update_cart($1, $2, $3)', [sessionId, product_id, quantity], (error, result) => {
        if (error) throw error;
        res.send('Cart updated');
    })
})

module.exports = router;