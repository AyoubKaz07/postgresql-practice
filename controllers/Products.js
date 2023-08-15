const pool = require('../db/dbconfig');
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
    const name = req.params.name;
    const sqlQuery = 'SELECT * FROM products WHERE name = $1';
    
    const result = await pool.query(sqlQuery, [name]);
    if (result.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }

    res.send(result.rows);
}

module.exports = {
    getProducts,
    getProduct
}