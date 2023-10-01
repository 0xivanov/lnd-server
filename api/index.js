const express = require('express');
const SSE = require('express-sse');
const cors = require("cors");
const { createHmac } = require('node:crypto');
const app = express();
const port = 3001; // Choose a port for your API
const sse = new SSE();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const verifiedPayments = new Array();

app.get('/sse', (req, res) => {
  res.flush = () => { };
  sse.init(req, res);
})

app.post('/send-event', (req, res) => {
  const message = req.body;

  console.log(message)
  sse.send(message);

  res.json({ success: true });
});

app.post('/payment', (req, res) => {
  const charge = req.body;
  const paymentId = charge.id
  const received = charge.hashed_order;
  const calculated = createHmac('sha256', 'e92064ab-0799-467c-8876-25bb1a393422').update(charge.id).digest('hex');
  if (received === calculated) {
    console.log("signiture is valid")
    verifiedPayments.push(paymentId)
    sse.send(paymentId);
    res.status(200).json({ message: 'payment received successfully' });
  }
  else {
    console.log("signiture is invalid")
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
