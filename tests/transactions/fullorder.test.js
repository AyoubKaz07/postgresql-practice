const pool = require('../../db/dbconfig');
const math = require('mathjs');

let session_id;
let product_id = math.randomInt(10, 20);
let quantity = math.randomInt(1, 5);
let customer_id;
let order_id;


beforeAll(async () => {
    const customer = await pool.query('INSERT INTO customers (first_name) VALUES ($1) RETURNING id', ['Test']);
    customer_id = customer.rows[0].id;
    const session = await pool.query('INSERT INTO shopping_session (customer_id) VALUES ($1) RETURNING id', [customer_id]);
    session_id = session.rows[0].id;
});

test('add to cart, finalize order, check order details', async () => {
    await pool.query('SELECT add_to_cart($1, $2, $3)', [session_id, product_id, quantity]);

    await pool.query('CALL finalize_order($1)', [session_id])

    const order = await pool.query('SELECT * from order_details ORDER BY order_date DESC LIMIT 1')
    order_id = order.rows[0].id;

    const order_items = await pool.query('SELECT * from order_items WHERE order_id = $1', [order.rows[0].id])

    const old_shopping_session = await pool.query('SELECT * from shopping_session where id = $1', [session_id])
    const old_cart_items = await pool.query('SELECT * from cart_item where session_id = $1', [session_id])

    expect(order.rows).toHaveLength(1);
    expect(order_items.rows).toHaveLength(1);
    expect(old_shopping_session.rows).toHaveLength(0);
    expect(old_cart_items.rows).toHaveLength(0);
});

afterAll(async () => {
    // Delete the custome, order, order_items, return the product to stock
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [order_id]);
    await pool.query('DELETE FROM order_details WHERE customer_id = $1', [customer_id]);
    await pool.query('DELETE FROM customers WHERE id = $1', [customer_id]);

    // Return the product to stock
    await pool.query('UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2', [quantity, product_id]);        
});