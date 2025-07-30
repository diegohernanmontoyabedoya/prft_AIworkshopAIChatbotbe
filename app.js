require('dotenv').config();
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');
const faqRouter = require('./routes/faq');
//const ordersRouter = require('./routes/orders');
//const productsRouter = require('./routes/products');


app.use(express.json());

// ...existing code...
const allowedOrigins = [
  'http://localhost:3001',
  'https://jolly-bay-06f377a03.1.azurestaticapps.net'
];

// Basic CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/faq', faqRouter);
//app.use('/orders', ordersRouter);
//app.use('/products', productsRouter);

app.get('/', (req, res) => {
  res.send('AI Chatbot Order Status Service is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;