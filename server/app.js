require('dotenv').config();

require('newrelic');
const express = require("express");
const app = express();
const port = 5000;
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const bodyParser = require("body-parser")
const cors = require('cors')
const generateInvoice = require('./helpers/pdfkit');
const PDFDocument = require('pdfkit');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/generate-invoice', (req, res) => {
  const invoice = {
    date: '15/07/2024',
    invoiceNumber: 'INV24070285',
    orderNumber: '2407AA0270',
    licensePlate: 'DK 2136 FBO',
    customer: {
      name: 'Moksun Hie',
      address: 'Jln DARMASABA',
      mobile: '0',
    },
    technician: 'ARI SETIAWA',
    members: '',
    company: {
      name: 'ABADI MOTOR KB JERUK',
      address: 'JL PANJANG 17 KEBON JERUK',
      taxId: '002897245031000',
    },
    motorType: 'NMAX ABS',
    items: [
      { no: 1, package: 'FSB', itemNumber: '', itemName: 'FULLSET BODY NMAX', unitCost: 1050000, discount: 0, quantity: 1, total: 1050000 },
      { no: 2, package: 'LMP', itemNumber: '', itemName: 'STOP LAMP NMAX', unitCost: 605000, discount: 0, quantity: 1, total: 605000 },
      { no: 3, package: 'KSB', itemNumber: 'ONGKOS OLI M+G', itemName: '', unitCost: 7500, discount: 0, quantity: 1, total: 7500 },
      { no: 4, package: 'Service Ringan', itemNumber: '', itemName: 'YAMALUBE SUPER MATI', unitCost: 74000, discount: 0, quantity: 1, total: 74000 },
      { no: 5, package: 'Spare Part', itemNumber: '90793-AJ465', itemName: 'YAMALUBE GEAR OIL 150', unitCost: 18500, discount: 0, quantity: 1, total: 18500 },
    ],
    totalService: 62500,
    totalSparePart: 92500,
    memberBenefitAmount: 0,
    totalBayar: 175000,
  };

  const filePath = 'invoice.pdf';
  generateInvoice(invoice, filePath);

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error generating invoice');
    }
  });
});

app.use(router);
app.use(errorHandler);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
