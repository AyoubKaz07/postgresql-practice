const pool = require('../../../config/db');
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

test('should update the cart', async () => {
    const new_quantity = 3;
    const new_options = {"costs": 500 };
    const new_med_pres = "https://www.facebook.com";
    
    await pool.query('CALL update_cart_item($1, $2, $3, $4)', [cart_item_id, new_quantity, new_options, new_med_pres]);

    const cart_item = await pool.query('SELECT * FROM cart_item WHERE id = $1', [cart_item_id]);

    // Check if the quantity of the cart item is updated
    expect(cart_item.rows[0].quantity).toEqual(new_quantity);

    // Check if the options of the cart item is updated
    expect(cart_item.rows[0].options).toEqual(new_options);

    // Check if the med_pres of the cart item is updated
    expect(cart_item.rows[0].medical_prescription).toEqual(new_med_pres);

    // Check if the subtotal of cart item is updated correctly
    const subtotal = await pool.query('SELECT subtotal FROM cart_item WHERE id = $1', [cart_item_id]);
    const product_price = await pool.query('SELECT price FROM products WHERE id = $1', [product_id]);

    const expected_subtotal = (product_price.rows[0].price + cart_item.rows[0].options.costs) * new_quantity;
    expect(subtotal.rows[0].subtotal).toEqual(expected_subtotal);
})

afterEach(async () => {
    await pool.query('DELETE FROM cart_item WHERE id = $1', [cart_item_id]);
})