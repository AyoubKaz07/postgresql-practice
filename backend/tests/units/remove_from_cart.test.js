const pool = require('../../config/db');
const math = require('mathjs');

let cart_item_id;
let session_id;
const product_id = 12;
const quantity = 2;
const options = {"costs": 1000 };
const med_pres = "https://www.google.com";

beforeEach(async () => {
    // create shopping session
    session_id = (await pool.query('INSERT INTO shopping_session (customer_id) VALUES ($1) RETURNING id', [math.randomInt(1, 20)])).rows[0].id;
    
    await pool.query('CALL add_to_cart($1, $2, $3, $4, $5)', [session_id, product_id, quantity, options, med_pres]);

    const cart_item = await pool.query('SELECT * FROM cart_item WHERE session_id = $1 AND product_id = $2 ORDER BY id DESC LIMIT 1;', [
        session_id,
        product_id,
    ]);
    cart_item_id = cart_item.rows[0].id;
})

test('should remove a product from the cart', async () => {

    await pool.query('CALL remove_from_cart($1)', [cart_item_id]);

    const cart_item = await pool.query('SELECT * FROM cart_item WHERE id = $1', [
        cart_item_id
    ]);

    expect(cart_item.rows.length).toEqual(0);
})