const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const bodyParser = require("body-parser")
const cors = require('cors')


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
