const pool = require('../db/dbconfig');


const finalizeOrder = async  (req, res) => {
    // temporary
    const sessionId = 5;
    pool.query('CALL finalize_shopping_order($1)', [sessionId], (error, result) => {
        if (error) throw error;
        res.send('Now you wait until it reaches you, for further info ...');
    })
}

const getOrders = async (req, res) => {
    // temporary (get customer id from session)
    const customer_id = 0;
    const result = await pool.query('SELECT * FROM order_details WHERE customer_id = $1', [customer_id]);

    if (result.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }

    res.send(result.rows);
}

const getOrder = async (req, res) => {
    const order_id = req.params.order_id;
    const result = await pool.query('SELECT * FROM order_details WHERE id = $1', [order_id]);

    if (result.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }

    res.send(result.rows);
}

const usedPayment = async (req, res) => {
    const order_id = req.params.order_id;
    const result = await pool.query('SELECT * FROM payment_details WHERE order_id = $1', [order_id]);

    if (result.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }
    
    res.send(result.rows);
}

module.exports = {
    finalizeOrder,
    getOrders,
    getOrder,
    usedPayment
}