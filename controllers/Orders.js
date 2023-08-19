const pool = require('../db/dbconfig');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const startCheckout = async (req, res) => {
    // temporary
    const sessionId = 310;
    
    try {
        // verify stock quantity
        await pool.query('CALL check_stock($1)', [sessionId])
    
        // get items to checkout
        const result = await pool.query('SELECT *, products.price as unit_price, products.discount as discount FROM cart_item JOIN products ON cart_item.product_id = products.id WHERE session_id = $1', [sessionId]);
        const items = result.rows;

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
            success_url: 'http://localhost:3000/orders/finalizeorder?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',
            allow_promotion_codes: true,
            shipping_address_collection: {
                allowed_countries: ['DZ'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        display_name: 'Free Shipping',
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 100,
                            currency: 'usd',
                        }
                    },
                }    
            ]
        });

    
        res.json({ url: checkout_session.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message});
    }
       
};


const finalizeOrder = async (req, res) => {
    try {
        // temporary
        const session_id = 310;

        // this is the stripe session id
        const stripe_sid = req.query.session_id;

        // retrieve needed data about the payment
        const session = await stripe.checkout.sessions.retrieve(stripe_sid);
        const shipping_details = {
            address: session.shipping_details.address,
            recipient_name: session.shipping_details.name,
            shipping_cost: session.shipping_cost
        };
        const paymentAmount = session.amount_total;
        const paymentMethod = session.payment_method_types[0];
        const paymentStatus = session.payment_status;
        
        // Use the payment details to finalize the order in your database
        await pool.query('CALL finalize_order($1, $2, $3, $4, $5)', [session_id, shipping_details, paymentAmount, paymentMethod, paymentStatus]);

        res.status(200).json({ details: session});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while finalizing the order' });
    }
};


const getCustomerOrders = async (req, res) => {
    // temporary (get customer id from session)
    const customer_id = 1;
    
    const result = await pool.query('SELECT * FROM order_details WHERE customer_id = $1', [customer_id]);

    if (result.rows.length === 0) {
        return res.status(200).send('No orders found');
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

const getOrders = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const { before, after } = req.query;
    
    let sqlparams = [];
    let sqlparam = 1;
    
    let sqlQuery = 'SELECT * FROM order_details';
    if (before) {
        sqlQuery += ` WHERE order_date < $${sqlparam}}`;
        sqlparam++;
        sqlparams.push(before);
    } else if (after) {
        sqlQuery += ` WHERE order_date > $${sqlparam}}`;
        sqlparam++;
        sqlparams.push(after);
    }
    sqlQuery += ` ORDER BY order_date DESC LIMIT $${sqlparam++} OFFSET $${sqlparam}`;
    sqlparams.push(limit, offset);

    const result = await pool.query(sqlQuery, sqlparams);

    if (result.rows.length === 0) {
        return res.status(200).send('No orders found');
    }

    res.send(result.rows);
}

const paymentDetails = async (req, res) => {
    const order_id = req.params.order_id;
    const result = await pool.query('SELECT payment_details.* FROM order_details as od JOIN payment_details as pd ON od.payment_id = pd.id WHERE od.id = $1 ', [order_id]);

    if (result.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }
    
    res.send(result.rows);
}

module.exports = {
    getOrders,
    finalizeOrder,
    getCustomerOrders,
    getOrder,
    paymentDetails,
    startCheckout
}