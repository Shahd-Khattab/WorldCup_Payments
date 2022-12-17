require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.post('/api/payments', async (req,res) => {
  try{
    var price= req.body.price
    price= price*100
    const charge = await stripe.charges.create({
      amount: price,
      currency: 'usd',
      source: 'tok_mastercard',
      description: 'WorldCup',
    });
    return res.status(200).json({
      success: true,
      message: 'Payment Successful',
      id: charge.id,
    });
  } catch(error) {
  console.log("Error ", error)
    return res.status(200).json({
      success: false,
      message: 'Payment Failed',
      errors:error.message
    })
  }
});

const port= 3001
app.listen(port, function (error) {
  
  // Checking any error occur while listening on port
  if (error) {
      console.log('Something went wrong', error);
  }
  // Else sent message of listening
  else {
      console.log('Server is listening on port ' + port);
  }
})