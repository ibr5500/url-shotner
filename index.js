require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to database');
  }).catch((err) => {
    console.error(err);
});

app.use(cors());
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', bodyParser.json(), (req, res) => {
  const original_url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
  console.log(req.headers);
  res.json({ original_url, short_url: 'shorturl' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
