const express = require('express');
const cors = require('cors');
const router = require('./routes');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/", router);
app.use("/uploads", express.static('uploads'));

module.exports = app;