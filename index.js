const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

// App
const app = express()

// Middleware
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }))

// Routes
app.post('/api/expenses', async (req, res) => {
  const expense = {
    contract_id: req.body.contractID,
    name: req.body.name,
    date: req.body.date,
    amount: parseInt(req.body.amount, 10),
    description: req.body.description,
    file: req.body.file[0]
  }

  const fileResponse = await axios.get(expense.file, {
    responseType: 'stream'
  })

  const uploadResponse = await axios.post(
    'https://api-gateway-demo.deel.network/rest/v1/invoice-adjustments', 
    {
      contract_id: 'myxvx4e',
      date_submitted: expense.date,
      type: 'expense',
      amount: expense.amount,
      description: expense.description,
      file: fileResponse.data
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer',
      }
    }
  )

  if (uploadResponse.status >= 400) {
    return res.status(500).json({
      success: false,
      message: 'Error uploading file'
    })
  }
  
  return res.json({
    success: true,
    message: 'File uploaded successfully'
  })
})

// Listen
const port = process.env.PORT || 3000
app.listen(port, () => 
  console.log(`Listening on port ${port}...`)
)
