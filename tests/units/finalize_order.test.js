const pool = require('../../db/dbconfig')

let session_id;
let order_id;

beforeEach(async () => {
    // create shopping session
    const shopping_session = await pool.query('INSERT INTO shopping_session (customer_id) VALUES ($1) RETURNING *', [40])
    session_id = shopping_session.rows[0].id;

    // add product to cart
    await pool.query('call add_to_cart($1, $2, $3, $4, $5)', [session_id, 5492321, 2, {"costs": 1000}, 'https://www.google.com/'])
})

test('Should finalize the order, clearing the cart', async () => {
    // gather cart items info
    let cart_items = await pool.query('SELECT * from cart_item where session_id = $1', [session_id]);
    cart_items = cart_items.rows;
    
    for (let i = 0; i < cart_items.length; i++) {
      delete cart_items[i].session_id;
      delete cart_items[i].id;
    }

    await pool.query('CALL finalize_order($1)', [session_id])

    const order = await pool.query('SELECT * from order_details ORDER BY order_date DESC LIMIT 1')
    order_id = order.rows[0].id;

    let order_items = await pool.query('SELECT * from order_items WHERE order_id = $1', [order_id])
    order_items = order_items.rows;
    
    for (let i = 0; i < order_items.length; i++) {
        delete order_items[i].order_id;
        delete order_items[i].id;
    }

    // check if cart_items and order_items are the same
    expect(cart_items).toEqual(order_items);
    
    const old_shopping_session = await pool.query('SELECT * from shopping_session where id = $1', [session_id])
    const old_cart_items = await pool.query('SELECT * from cart_item where session_id = $1', [session_id])

    expect(old_shopping_session.rows).toHaveLength(0);
    expect(old_cart_items.rows).toHaveLength(0);
})

test('Should throw stock error', async () => {
    // create product with 0 stock
    await pool.query('INSERT INTO products (name, price, stock_quantity, category_id) VALUES ($1, $2, $3, $4)', ['test', 10, 0, 1])

    session_id = (await pool.query('INSERT INTO shopping_session (customer_id) VALUES ($1) RETURNING *', [40])).rows[0].id;
    await pool.query('call add_to_cart($1, $2, $3, $4, $5)', [session_id, 1, 1, {"costs": 1000}, 'https://www.google.com/'])

    await pool.query('CALL finalize_order($1)', [session_id]).catch(e => {
        expect(e.message).toMatch('Some products have insufficient stock');
    });
})

afterAll(async () => {
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [order_id]);
    await pool.query('DELETE FROM order_details WHERE id = $1', [order_id]);
});