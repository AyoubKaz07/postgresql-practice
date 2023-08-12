const pool = require('../../db/dbconfig')


test('Should finalize the order, clearing the cart', async () => {
    const session_id = 2
    await pool.query('CALL finalize_order($1)', [session_id])

    const order = await pool.query('SELECT * from order_details ORDER BY order_date DESC LIMIT 1')
    const order_items = await pool.query('SELECT * from order_items WHERE order_id = $1', [order.rows[0].id])

    const old_shopping_session = await pool.query('SELECT * from shopping_session where id = $1', [session_id])
    const old_cart_items = await pool.query('SELECT * from cart_item where session_id = $1', [session_id])

    expect(order.rows).toHaveLength(1);
    expect(order_items.rows).toHaveLength(1);
    expect(old_shopping_session.rows).toHaveLength(0);
    expect(old_cart_items.rows).toHaveLength(0);
})