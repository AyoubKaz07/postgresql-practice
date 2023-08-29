const pool = require('../../../config/db');

let product_id;

test('should add new product', async () => {
    // generate random product data in correct order
    const product = {
        name: 'test product',
        description: 'test description',
        price: 100,
        quantity: 10,
        gender: 'M',
        size : 'S',
        discount: 0,
        brand: 'Gucci',
        category: 'sunglasses'
    };

    // add product to database
    const result = await pool.query('SELECT * FROM add_product($1, $2, $3, $4, $5, $6, $7, $8, $9)', Object.values(product));
    product_id = result.rows[0].id;

    // check if product was added
    const productExists = await pool.query('SELECT * FROM products WHERE name = $1', [product.name]);
    expect(productExists.rows[0]).toEqual(result.rows[0]);
});

afterEach(async () => {
    // delete product from database
    await pool.query('DELETE FROM products WHERE id = $1', [product_id]);
});