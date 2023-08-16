const express = require('express');
const app = express();
require('dotenv').config();
const cartRouter = require('./routes/carts');
const productRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const categoriesRouter = require('./routes/categories');


const port = 3000;

app.use(express.json());
app.use('/carts', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productRouter);
app.use('/orders', ordersRouter);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

module.exports = app;