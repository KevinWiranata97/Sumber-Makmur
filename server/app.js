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

const path = require('path');
const fs = require('fs');
newrelic.instrumentLoadedModule(
  'express',    // the module's name, as a string
  expressModule // the module instance
);

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/download-invoice/:filename', (req, res) => {
  // Get the filename from the URL parameter
  const { filename } = req.params;

  // Construct the file path in the server/data/invoice directory
  const filePath = path.join(__dirname, 'data', 'invoice', filename);

  
  
  // Ensure the file exists
  if (fs.existsSync(filePath)) {
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } else {
    // If file doesn't exist, send a 404 error
    res.status(404).json({
      error: true,
      msg: 'File not found',
    });
  }
});
app.use(router);
app.use(errorHandler);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
