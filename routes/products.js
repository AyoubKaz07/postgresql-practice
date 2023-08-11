const express = require('express');
const router = express.Router();

const pool = require('../db/dbconfig');
const applyFilterOptions = require('./utils/applyFilters');


router.get('/:category_name', (req, res) => {
    try {
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
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/:category_name/:id', async (req, res) => {
    const id = req.params.id;
    const sqlQuery = 'SELECT * FROM products WHERE id = $1';

    const valid_category = await pool.query('SELECT * FROM categories WHERE name = $1', [req.params.category_name]);

    if (valid_category.rows.length === 0) {
        return res.status(404).send('Page Not Found');
    }
    
    pool.query(sqlQuery, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('INTERNAL SERVER ERROR');
        }

        if (result.rows.length === 0) {
            return res.status(404).send('Page Not Found');
        }
        res.send(result.rows);
    });
});


module.exports = router;