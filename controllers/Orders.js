const pool = require('../db/dbconfig');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const startCheckout = async (req, res) => {
    const sessionId = 148;
    // get items to checkout
    const result = await pool.query('SELECT *, products.price as unit_price, products.discount as discount FROM cart_item JOIN products ON cart_item.product_id = products.id WHERE session_id = $1', [sessionId]);
    const items = result.rows;

    try {
        const line_items = await Promise.all(
            items.map(async (item) => {
                const product = await stripe.products.create({
                    name: item.name,
                });

                let discounted_unit_amount = item.subtotal;
                if (item.discount !== 0) {
                    // calculate discounted amount
                    discounted_unit_amount -= (discounted_unit_amount * item.discount / 100);
                }

                const price = await stripe.prices.create({
                    currency: 'usd',
                    unit_amount: discounted_unit_amount, // Use the discounted amount
                    product: product.id,
                });
    
                const lineItem = {
                    price: price.id,
                    quantity: item.quantity,
                };
    
                return lineItem;
            })
        );
    
        const checkout_session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: 'http://localhost:3000/payment_success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',
            allow_promotion_codes: true,
        });
    
        res.json({ url: checkout_session.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while starting the checkout' });
    }
       
};


const finalizeOrder = async (req, res) => {
    try {
        // temporary
        const session_id = 148;

        // this is the stripe session id
        const stripe_sid = 'cs_test_b1rbCOfPFnLsowmLat7lQowwZpNooIDVYO2EDwdOaLqlwngpn7HD50P9NN'

        const session = await stripe.checkout.sessions.retrieve(stripe_sid);
        const shipping_address = session.customer_details.address;
        const paymentAmount = session.amount_total;
        const paymentMethod = session.payment_method_types[0];
        const paymentStatus = session.payment_status;
        
        // Use the payment details to finalize the order in your database
        await pool.query('CALL finalize_order($1, $2, $3, $4, $5)', [session_id, shipping_address, paymentAmount, paymentMethod, paymentStatus]);

        res.status(200).json({ message: 'Order finalized successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while finalizing the order' });
    }
};


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
    usedPayment,
    startCheckout
}