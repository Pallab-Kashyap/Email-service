const express = require('express');
const brevo = require('@getbrevo/brevo');
const dotenv = require('dotenv')
const cors = require('cors')

const app = express()

dotenv.config()

app.use(cors({
  origin: '*'
}))

app.use(express.json())
app.get('/', (req, res) => { res.send("Email Service Backend") })
app.post('/', async (req, res) => {

    const { firstName, lastName, email, phone, message } = req.body

    let defaultClient = brevo.ApiClient.instance;
    
    let apiKey = await defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    
    let apiInstance = new brevo.TransactionalEmailsApi();

    const sender = {
        email: process.env.SENDER_EMAIL,
        name: 'RBF INDUSTRIES'
    };

    const receivers = [
        {
            email: process.env.RECEIVER_EMAIL,

        }
    ]
    
    try{
        const data = await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject: "test email with sandinblue",
            textContent: "test email",
            htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #0073e6;
    }
    p {
      margin: 5px 0;
    }
    .label {
      font-weight: bold;
      margin-right: 10px;
    }
    .footer {
      font-size: 12px;
      color: #777;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Contact Us Submission</h2>
    <p><span class="label">Name:</span>${`${firstName} ${lastName}`}</p>
    <p><span class="label">Email:</span> ${email}</p>
    <p><span class="label">Phone:</span> ${phone}</p>
    <p><span class="label">Message:</span>${message}</p>

    <div class="footer">
      <p>This email was generated automatically from the contact form submission on your website.</p>
    </div>
  </div>
</body>
</html>
`
        })
        res.status(200).json({status: true})
    }catch(err){
      console.log(err);
        res.status(500).json({status: false})
    }
})

app.listen(3001, ()=> console.log('server started'))