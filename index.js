const dotenv = require('dotenv')
dotenv.config()
const authKey = process.env.API_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const axios = require('axios')
const { z } = require('zod')

// App
const app = express()

// Middleware
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }))
app.use(morgan('tiny'))

// Routes
app.post('/api/expenses', async (req, res) => {
  const { success, data } = z.object({
    contract_id: z.string(),
    date: z.string(),
    type: z.string(),
    amount: z.number(),
    description: z.string(),
    file: z.array(
      z.string().url()
    ).nonempty(),
  }).safeParse(req.body)

  if (!success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body',
    })
  }

  const expense = {
    contract_id: data.contract_id,
    date: data.date,
    type: data.type,
    amount: data.amount,
    description: data.description,
    file: data.file[0]
  }

  try {
    var fileResponse = await axios.get(expense.file, {
      responseType: 'stream'
    })
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching file',
    })
  }

  try {
    const uploadResponse = await axios.post(
      'https://api.letsdeel.com/rest/v1/invoice-adjustments', 
      {
        contract_id: expense.contract_id,
        date_submitted: expense.date,
        type: expense.type,
        amount: expense.amount,
        description: expense.description,
        file: fileResponse.data
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authKey,
        }
      }
    )

    if (uploadResponse.status >= 400) {
      return res.status(500).json({
        success: false,
        message: 'Error uploading file'
      })
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error saving expense to LetsDeel',
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
