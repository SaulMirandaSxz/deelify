const express = require('express')

const bodyParser = require('body-parser')

const app = express();

const axios = require('axios').default;

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
app.use(bodyParser.json())

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





app.listen(port, host, function () {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});




