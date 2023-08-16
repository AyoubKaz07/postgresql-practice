const pool = require('../db/dbconfig');

const addToCart = async (req, res) => {
    const { product_id, quantity, options, med_pres }  = req.body;
    // temporary
    const sessionId = 5;
    pool.query('CALL add_to_cart($1, $2, $3, $4, $5)', [sessionId, product_id, quantity, options, med_pres], (error, result) => {
        if (error) throw error;
        res.send('Product added to cart');
    })
}

const removeFromCart = async (req, res) => {
    const cart_item_id = req.params.id;
    pool.query('CALL remove_from_cart($1)', [cart_item_id], (error, result) => {
        if (error) throw error;
        res.send('Product removed from cart');
    })
}

const updateCart = async (req, res) => {
    const cart_item_id = req.params.id;
    const { quantity, options, med_pres } = req.body;

    pool.query('CALL update_cart_item($1, $2, $3, $4)', [cart_item_id, quantity, options, med_pres], (error, result) => {
        if (error) throw error;
        res.send('Cart updated');
    })
}

const getCart = async (req, res) => {
    // temporary
    const sessionId = 18;
    const cart = await pool.query('SELECT * FROM get_cart($1)', [sessionId]);

    if (cart.rows.length === 0) {
        res.send('Cart is empty');
    }

    res.json(cart.rows);
}

module.exports = {
    addToCart,
    removeFromCart,
    updateCart,
    getCart
}