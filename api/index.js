const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3001; // Choose a port for your API

// Middleware to parse JSON requests
app.use(express.json());

app.get('/home', (req, res) => {
  res.end(`Hello! Go to item:`);
});

app.post('/payment', (req, res) => {
  try {
    const charge = req.body;
    const received = charge.hashed_order;
    const calculated = crypto.createHmac('sha256', 'e92064ab-0799-467c-8876-25bb1a393422').update(charge.id).digest('hex');
    if (received === calculated) {
      console.log("signiture is valid")
      res.status(200).json({ message: 'Payment received successfully' });
    }
    else {
      console.log("signiture is invalid")
    }
  } catch (error) {
    console.log(error)
  }

});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
