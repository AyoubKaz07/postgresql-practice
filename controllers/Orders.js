const pool = require('../db/dbconfig');


const finalizeOrder = async  (req, res) => {
    // temporary
    const sessionId = 5;
    pool.query('CALL finalize_shopping_order($1)', [sessionId], (error, result) => {
        if (error) throw error;
        res.send('Now you wait until it reaches you, for further info ...');
    })
}

module.exports = {
    finalizeOrder
}