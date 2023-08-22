const pool = require('../../config/db');
const math = require('mathjs');

let session_id;
let product_id = 201166 // has a lot of stock
let quantity = math.randomInt(1, 5);
let customer_id;
let order_id;


beforeEach(async () => {
    const customer = await pool.query('INSERT INTO customers (first_name) VALUES ($1) RETURNING id', ['Test']);
    customer_id = customer.rows[0].id;
    const session = await pool.query('INSERT INTO shopping_session (customer_id) VALUES ($1) RETURNING id', [customer_id]);
    session_id = session.rows[0].id;
});

test('add to cart, finalize order, check order details', async () => {
    await pool.query('CALL add_to_cart($1, $2, $3, $4, $5)', [session_id, product_id, quantity, {"costs": 100}, 'testprescription']);

    // expect no errors could fail in case
    await pool.query('CALL check_stock($1)', [session_id]).catch(e => {
        expect(e).toBeFalsy();
    });

    await pool.query('CALL finalize_order($1, $2, $3, $4, $5)', [session_id, {"": ""}, 120, 'card', 'paid']).catch(e => {
        expect(e).toBeFalsy();
    });

    const order = await pool.query('SELECT * from order_details ORDER BY order_date DESC LIMIT 1')
    order_id = order.rows[0].id;

    const order_items = await pool.query('SELECT * from order_items WHERE order_id = $1', [order.rows[0].id])

    const old_shopping_session = await pool.query('SELECT * from shopping_session where id = $1', [session_id])
    const old_cart_items = await pool.query('SELECT * from cart_item where session_id = $1', [session_id])

    expect(order.rows).toHaveLength(1);
    expect(order_items.rows).toHaveLength(1);
    expect(old_shopping_session.rows).toHaveLength(0);
    expect(old_cart_items.rows).toHaveLength(0);

    // Delete the custome, order, order_items, return the product to stock
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [order_id]);
    await pool.query('DELETE FROM order_details WHERE id = $1', [order_id]);
    await pool.query('DELETE FROM payment_details WHERE id = $1', [order.rows[0].payment_id]);
    await pool.query('DELETE FROM customers WHERE id = $1', [customer_id]);


    // Return the product to stock
    await pool.query('UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2', [quantity, product_id]); 
});

test('edge case: product with 0 stock quantity', async () => {
    // Create a product with 0 stock quantity
    const zeroStockProduct = await pool.query('INSERT INTO products (name, stock_quantity, price) VALUES ($1, $2, $3) RETURNING id', ['Zero Stock Product', 0, 100]);
    const zeroStockProductId = zeroStockProduct.rows[0].id;
  
    // Perform operations that involve the zero stock product, if needed
    await pool.query('CALL add_to_cart($1, $2, $3, $4, $5)', [session_id, zeroStockProductId, quantity, {"costs": 100}, 'testprescription']);

    // expect a thrown error
    await pool.query('CALL check_stock($1)', [session_id]).catch(e => {
        expect(e).toBeTruthy();
    });

    // Delete the shopping session, cart items, and the zero stock product after the test
    await pool.query('DELETE FROM cart_item WHERE session_id = $1', [session_id]);
    await pool.query('DELETE FROM shopping_session WHERE id = $1', [session_id]);
    await pool.query('DELETE FROM products WHERE id = $1', [zeroStockProductId]);
    await pool.query('DELETE FROM customers WHERE id = $1', [customer_id]);
});