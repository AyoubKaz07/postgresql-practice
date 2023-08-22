const pool = require('../../config/db');
const applyFilterOptions = require('../utils/applyFilters');



const getProducts = (req, res) => {
    const { category_name } = req.params;
    
    let sqlQuery = 'SELECT * FROM products WHERE category_id = (SELECT id FROM categories WHERE name = $1)';
    let queryParams = [category_name];
    
    const { sort, brand, gender, page } = req.query;
    
    sqlQuery = applyFilterOptions(sqlQuery, { sort, brand, gender, page }, queryParams);
    
    pool.query(sqlQuery, queryParams, (error, result) => {
        if (error) throw error;
        
        if (result.rows.length === 0) {
            return res.status(404).send('Page Not Found');
        }
        res.send(result.rows);
    })
};

const getProduct = async (req, res) => {
    const id = req.params.id;
    const sqlQuery = 'SELECT * FROM products WHERE id = $1';
    
    const result = await pool.query(sqlQuery, [id]);
    if (result.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }

    res.send(result.rows);
}

const updateProduct = async (req, res) => {
    const id = req.params.id;

    const productExists = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productExists.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }

    const sqlQuery = 'SELECT * FROM update_product($1, $2, $3, $4, $5, $6, $7, $8, $9)';

    const result = await pool.query(sqlQuery, [id, ...Object.values(req.body)]);

    res.send(result.rows);
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;

    const productExists = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productExists.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }

    const sqlQuery = 'DELETE FROM products WHERE id = $1';

    await pool.query(sqlQuery, [id]);

    res.send('Product Deleted');
};

const addProduct = async (req, res) => {
    // product should be an object with the right properties
    const product = req.body;

    // add product to database
    const result = await pool.query('SELECT * FROM add_product($1, $2, $3, $4, $5, $6, $7, $8, $9)', Object.values(product));

    res.send(result.rows);
};

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
}