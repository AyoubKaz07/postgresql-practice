const express = require('express');
const router = express.Router();

const pool = require('../db/dbconfig');


router.post('/finalizeorder', (req, res) => {
    // temporary
    const sessionId = 5;
    pool.query('CALL finalize_shopping_order($1)', [sessionId], (error, result) => {
        if (error) throw error;
        res.send('Now you wait until it reaches you, for further info ...');
    })
})



module.exports = router;