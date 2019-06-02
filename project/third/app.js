const bodyParser = require('body-parser')
const express = require('express');
const app = express();

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// to support JSON-encoded bodies
app.use(bodyParser.json());

//importing route
const routes = require('./router/block');
//register the route
routes(app);

app.listen(8000, () => console.log('myBlockchain API is listening on port 8000'));
