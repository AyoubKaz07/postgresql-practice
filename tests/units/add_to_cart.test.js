const pool = require('../../db/dbconfig');

const session_id = 19;
const product_id = 12;
const quantity = 2;
const options = {"costs": 1000 };
const med_pres = "https://www.google.com";

test('should add a product to the cart', async () => {

    await pool.query('CALL add_to_cart($1, $2, $3, $4, $5)', [session_id, product_id, quantity, options, med_pres]);

    const added_product = await pool.query('SELECT * FROM cart_item WHERE session_id = $1 AND product_id = $2', [session_id, product_id]);
    const cart_items = await pool.query('SELECT * FROM cart_item WHERE session_id = $1', [session_id]);
    expect(cart_items.rows).toContainEqual(added_product.rows[0]);
})

afterAll(async () => {
    await pool.query('DELETE FROM cart_item WHERE session_id = $1', [session_id]);
})