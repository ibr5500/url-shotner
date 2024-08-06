require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongo = require('mongodb');
const mongoose = require('mongoose');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl', (req, res) => {
  const original_url = `${req.protocol}://${req.hostname}`;

  res.json({ original_url, short_url: 'shorturl' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
