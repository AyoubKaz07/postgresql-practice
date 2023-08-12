const pool = require('../../db/dbconfig');

const session_id = 2;
const product_id = 1;
const quantity = 3;

test('should update the cart', async () => {

    
    await pool.query('SELECT update_cart($1, $2, $3)', [session_id, product_id, quantity])
    
    const cart_item = await pool.query('SELECT * FROM cart_item WHERE session_id = $1 AND product_id = $2', [
        session_id,
        product_id,
    ]);

    expect(cart_item.rows[0].quantity).toEqual(quantity);
    
    // Check if the total of the shopping session is set correctly
    const shopping_session_total = await pool.query('SELECT total FROM shopping_session WHERE id = $1', [session_id])
    const expected_total = await pool.query('SELECT SUM(price * quantity)::integer AS total FROM cart_item ci JOIN products p ON ci.product_id = p.id WHERE ci.session_id = $1', [session_id])
    expect(shopping_session_total.rows[0].total).toEqual(expected_total.rows[0].total);
})