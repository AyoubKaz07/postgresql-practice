const pool = require('../../db/dbconfig');
const math = require('mathjs');

let cart_item_id;
let session_id;
const product_id = 12;
const quantity = 2;
const options = {"costs": 1000 };
const med_pres = "https://www.google.com";

test('should add a product to the cart', async () => {
    // create shopping session
    session_id = (await pool.query('INSERT INTO shopping_session (customer_id) VALUES ($1) RETURNING id', [math.randomInt(1, 20)])).rows[0].id;
    
    await pool.query('CALL add_to_cart($1, $2, $3, $4, $5)', [session_id, product_id, quantity, options, med_pres]);

    const added_product = await pool.query('SELECT * FROM cart_item WHERE session_id = $1 AND product_id = $2', [session_id, product_id]);
    const cart_items = await pool.query('SELECT * FROM cart_item WHERE session_id = $1', [session_id]);
    expect(cart_items.rows).toContainEqual(added_product.rows[0]);
})

afterAll(async () => {
    await pool.query('DELETE FROM cart_item WHERE session_id = $1', [session_id]);
    await pool.query('DELETE FROM shopping_session WHERE id = $1', [session_id]);
})