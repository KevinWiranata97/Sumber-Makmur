require('dotenv').config();

const expressModule = require('express');

// load the agent
const newrelic = require('newrelic');

// instrument express after the agent has been loaded
newrelic.instrumentLoadedModule(
  'express',    // the module's name, as a string
  expressModule // the module instance
);

const express = require("express");
const app = express();
const port = 5000;
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const bodyParser = require("body-parser")
const cors = require('cors')
const generateInvoice = require('./helpers/pdfkit');
const PDFDocument = require('pdfkit');
newrelic.instrumentLoadedModule(
  'express',    // the module's name, as a string
  expressModule // the module instance
);

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(router);
app.use(errorHandler);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
