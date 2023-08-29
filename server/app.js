const express = require('express');
const next = require('next');
const dotenv = require('dotenv');

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const appNext = next({ dev });
const handle = appNext.getRequestHandler();

appNext.prepare().then(() => {
  const app = express();

  // Add your existing Express middleware and routes here
  app.use(express.json());
  app.use('/api/carts', require('./routes/carts'));
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));

  // Next.js request handler
  app.get('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Express app listening on port ${port}`);
  });
});