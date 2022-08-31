const express = require('express')

const request = require('request')

const axios = require('axios')

const FormData = require('form-data')

const bodyParser = require('body-parser')

const app = express();

const fs = require('fs');
const { json } = require('body-parser')


// Create appliation/json parser
var JsonParser = bodyParser.json();

// Create application/x-www-form-urlencoded parser
var UrlEncodedParser = bodyParser.urlencoded({ extended: false });

const host = '143.244.156.170';
const port =  process.env.PORT || 3000;


// Expense list sample
const expenses = [
    { name: "string", amount: 1500, file: "string.jpg" },
    { name: "string1", amount: 1500, file: "string1.jpg"} ];


// parse application/json
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the Devbase API Service',
    })
});

// GET All expenses
app.get('/api/expenses', (req, res) => {
    res.send(expenses);
});


// Request last Expense file URL submited and storage it into variable

const axiosRequest1 = async () => {
try {
  const resp = await axios ({
    method: 'GET',
    url: 'http://143.244.156.170/api/expenses',
  })
        const a = await JSON.stringify(resp.data[resp.data.length - 1].file);
        const aString = a.replace("[", "").replace("\"", "").replace("]", "").replaceAll('"', '')
        console.log(aString)
        return aString;
      } catch (error) {
        console.error(error);
      }
}


// Use Expense file URL and upload it temporary into the server
  const axiosRequest2 = async () => {
  try {
      const resp = await axios.get( await axiosRequest1(), {responseType: "stream"})
          const b = await resp.data.pipe(fs.createWriteStream( 'file.pdf' ));
         console.log(b)
          return b;
  
  
  } catch (error) {
    console.error(error);
  }
    
  }

  
// Send form data to Let's Deel including previous file 
  
const formData = async () => {
var options = {
  'method': 'POST',
  'url': 'https://api-gateway-demo.deel.network/rest/v1/invoice-adjustments',
  'headers': {
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ2MjM2OCwicHJvZmlsZUlkIjo1MzM2MDgsIm9yZ2FuaXphdGlvbklkIjoyODM3Nn0.eOGdGNrl2ydaC3Cftug9KtG-130uj3TxI3hF-fFDVggFt-oZUwxBRAuqDXJb2OZHtp3X37SOHVsoiWuKUZtqJuC8ohZqQrgdpzY8THc9N2Y57TF7iOXeccgQLx45IyZqdZZA8_1rT1nCO86IlOSwLQoEE9sLXVF32VAKplxPRLvnpmaU5OLm0U7c02orOg74ZFuGpeAae07vxaV91QebGfUQU6lXS7-9zo1Sxl8X9pw_8Xkm9yIG_auVaC4JdjAlovsBSW_Ox5u7g4u9Ony2KGB6DhBUKa0HflnxIz1L-wDm2s8X4t9LctRoMuK4SNlVPfp-jyaj3qvO3B1gja_YuFcS8tgYE1XeahfwSMXiQAvptP-F1BFNUqnZFKwAZBVhi9d_QHAwV04bqrGkYHq_e9xmZUz5XEcMQ4UDp-_9dIwwTZFTzX5j6LARNQLI09W4ScvS97-NNzLeqgNm6THFHQoujC2ZglYt7iTBkGkhgtGZgXuNMXBqNnirDc6Pirbu'
  },
  json:true,
  formData: {
    'contract_id': 'myxvx4e',
    'date_submitted': '2022-08-22',
    'type': 'expense',
    'amount': 2000,
    'description': 'Catnip4',
    'file': {
     // 'value': fs.createReadStream('/Users/saxs_/Documents/GitHub/NodeDevbase/images/V44ZdDK.png'), 
      'value': fs.createReadStream('file.pdf'),
      'options': {
        'filename': 'file.pdf',
        'contentType': null
      }
    }
  }
}

// Delete file from server 
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(response.body);
  if (response.body = true ) {
    fs.unlinkSync('file.pdf');
  }

});

}

// Request post Method to add new expense from airtable and start functions. 

app.post('/api/expenses', JsonParser, function (req, res) {
  const expense = {
      name: req.body.name,
      amount: parseInt(req.body.amount),
      file: req.body.file,
  }
  expenses.push(expense);

  res.send(  axiosRequest1(), axiosRequest2(), formData()  );
});





// Start Server
if (process.env.NODE_ENV !== 'production') {
        require('longjohn')
}
app.listen(port, host, function () {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
