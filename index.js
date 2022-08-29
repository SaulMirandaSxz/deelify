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

const host = '0.0.0.0';
const port =  process.env.PORT || 5000;





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


app.get('/api/expenses', (req, res) => {
    res.send(expenses);
});


app.post('/api/expenses', JsonParser, function (req, res) {
    const expense = {
        name: req.body.name,
        amount: parseInt(req.body.amount),
        file: req.body.file,
    }
    
    expenses.push(expense);
    res.send(expense);
});


/*
async function axiosURL() {

// Remove the URL Protocol (https:// & http://) using regex.
  

const response2 = axios.get('https://i.imgur.com/8uJcFxW.jpg', { responseType: 'stream' });  

return response2

.then( result  => 
    {
      console.log(result.data.responseUrl);
      res = result; 
      return result 
      }
    )
    .catch(err => console.error(err));

}  

*/


const getData = async () => { 

var config = {
  method: 'get',
  url: 'http://143.244.156.170/api/expenses',
  headers: { }
};

axios(config)
.then((response) => {
    var jsonData = JSON.stringify(response.data[response.data.length - 1].file.join(' '))
    console.log(jsonData)
    return jsonData
})

}

var URLpath = JSON.stringify(getData())
axios.get(URLpath, { responseType: "stream" })
    .then(response => {
      // Saving file to working directory  
      var responseData = response.data.pipe(fs.createWriteStream("receipt.png"))
      responseData
      console.log(responseData)

    })
    .catch(error => {
      console.log(error)
    })


/*

var options = {
  'method': 'POST',
  'url': 'https://api-gateway-demo.deel.network/rest/v1/invoice-adjustments',
  'headers': {
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ2MjM2OCwicHJvZmlsZUlkIjo1MzM2MDgsIm9yZ2FuaXphdGlvbklkIjoyODM3Nn0.eOGdGNrl2ydaC3Cftug9KtG-130uj3TxI3hF-fFDVggFt-oZUwxBRAuqDXJb2OZHtp3X37SOHVsoiWuKUZtqJuC8ohZqQrgdpzY8THc9N2Y57TF7iOXeccgQLx45IyZqdZZA8_1rT1nCO86IlOSwLQoEE9sLXVF32VAKplxPRLvnpmaU5OLm0U7c02orOg74ZFuGpeAae07vxaV91QebGfUQU6lXS7-9zo1Sxl8X9pw_8Xkm9yIG_auVaC4JdjAlovsBSW_Ox5u7g4u9Ony2KGB6DhBUKa0HflnxIz1L-wDm2s8X4t9LctRoMuK4SNlVPfp-jyaj3qvO3B1gja_YuFcS8tgYE1XeahfwSMXiQAvptP-F1BFNUqnZFKwAZBVhi9d_QHAwV04bqrGkYHq_e9xmZUz5XEcMQ4UDp-_9dIwwTZFTzX5j6LARNQLI09W4ScvS97-NNzLeqgNm6THFHQoujC2ZglYt7iTBkGkhgtGZgXuNMXBqNnirDc6Pirbu'
  },
  json:true,
  formData: {
    'contract_id': '39eeg4q',
    'date_submitted': '2022-08-22',
    'type': 'expense',
    'amount': 2000,
    'description': 'Catnip4',
    'file': {
     // 'value': fs.createReadStream('/Users/saxs_/Documents/GitHub/NodeDevbase/images/V44ZdDK.png'), 
      'value': fs.createReadStream('jsonEncodedURL'),
      'options': {
        'filename': 'jsonEncodedURL',
        'contentType': null
      }
    }
  }
}
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(response.body);
  if (response.body = true ) {
    fs.unlinkSync('jsonEncodedURL');
  }

});



*/





if (process.env.NODE_ENV !== 'production') {

        require('longjohn')

}



app.listen(port, host, function () {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
