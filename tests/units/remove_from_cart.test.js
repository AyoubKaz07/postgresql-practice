const pool = require('../../db/dbconfig');

const session_id = 19;
const product_id = 12;

test('should remove a product from the cart', async () => {

    
    await pool.query('SELECT remove_from_cart($1, $2)', [session_id, product_id])

    const cart_item = await pool.query('SELECT * FROM cart_item WHERE session_id = $1 AND product_id = $2', [
        session_id,
        product_id,
    ]);

    expect(cart_item.rows.length).toEqual(0);
})