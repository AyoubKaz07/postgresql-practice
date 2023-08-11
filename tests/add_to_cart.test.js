const pool = require('../db/dbconfig');

describe('Test add_to_cart function', () => {
    it('should add a product to the cart', async () => {

        const session_id = 2;
        const product_id = 12;
        const quantity = 2;

        pool.query('SELECT add_to_cart($1, $2, $3)', [session_id, product_id, quantity]);

        const added_product = await pool.query('SELECT * FROM shopping_cart WHERE session_id = $1 AND product_id = $2', [session_id, product_id]);
        const cart_items = await pool.query('SELECT * FROM cart_item WHERE session_id = $1', [session_id]);
        expect(cart_items.rows).toContain(added_product.rows[0]);
    })
})