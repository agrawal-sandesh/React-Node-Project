const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/routes/routing');
const errorLogger = require('./src/utilities/errorlogger');
const requestLogger = require('./src/utilities/requestlogger');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);

app.listen(4000);
console.log("Server listening in port 4000");

module.exports = app;