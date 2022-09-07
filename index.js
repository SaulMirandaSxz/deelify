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
    name: z.string(),
    amount: z.number(),
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
    name: data.name,
    amount: data.amount,
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
      'https://api-gateway-demo.deel.network/rest/v1/invoice-adjustments', 
      {
        contract_id: 'myxvx4e',
        date_submitted: '2022-05-11',
        type: 'expense',
        amount: 10000,
        description: 'WEDNESSDAY TEST',
        file: fileResponse.data
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ2MjM2OCwicHJvZmlsZUlkIjo1MzM2MDgsIm9yZ2FuaXphdGlvbklkIjoyODM3Nn0.eOGdGNrl2ydaC3Cftug9KtG-130uj3TxI3hF-fFDVggFt-oZUwxBRAuqDXJb2OZHtp3X37SOHVsoiWuKUZtqJuC8ohZqQrgdpzY8THc9N2Y57TF7iOXeccgQLx45IyZqdZZA8_1rT1nCO86IlOSwLQoEE9sLXVF32VAKplxPRLvnpmaU5OLm0U7c02orOg74ZFuGpeAae07vxaV91QebGfUQU6lXS7-9zo1Sxl8X9pw_8Xkm9yIG_auVaC4JdjAlovsBSW_Ox5u7g4u9Ony2KGB6DhBUKa0HflnxIz1L-wDm2s8X4t9LctRoMuK4SNlVPfp-jyaj3qvO3B1gja_YuFcS8tgYE1XeahfwSMXiQAvptP-F1BFNUqnZFKwAZBVhi9d_QHAwV04bqrGkYHq_e9xmZUz5XEcMQ4UDp-_9dIwwTZFTzX5j6LARNQLI09W4ScvS97-NNzLeqgNm6THFHQoujC2ZglYt7iTBkGkhgtGZgXuNMXBqNnirDc6Pirbu',
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
