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
    pool.query('SELECT * FROM orders WHERE customer_id = $1', [customer_id], (error, result) => {
        if (error) throw error;
        res.send(result.rows);
    })
    if (result.rows.length === 0) {
        return res.status(200).send('You have no orders yet');
    }
}

const getOrder = async (req, res) => {
    const order_id = req.params.order_id;
    pool.query('SELECT * FROM orders WHERE id = $1', [order_id], (error, result) => {
        if (error) throw error;
        res.send(result.rows);
    })

    if (result.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }
}


module.exports = {
    finalizeOrder,
    getOrders,
    getOrder
}