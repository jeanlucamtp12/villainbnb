const express = require('express');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

//definição da aplicação e de porta de conexão 
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


require('./controllers/authController')(app);

app.listen(3000);