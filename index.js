require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const dns = require('dns');
const urlParser = require('url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to database');
  }).catch((err) => {
    console.error(err);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ShortUrl = mongoose.model("ShortUrl", new mongoose.Schema({
  original_url: String,
  suffix: String
}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async (req, res) => {

  const { url } = req.body;

  const parsedURL = urlParser.parse(url);
  const { hostname } = parsedURL;

  if (!hostname) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, async (err) => {
    if(err) {
      return res.json({ error: 'invalid url' });
    }

    const suffix = shortid.generate();

    let newURL = new ShortUrl({
      original_url: url,
      suffix: suffix
    });

    try {
      await newURL.save();
      console.log('Saving to database');
      res.json({
        original_url: newURL.original_url,
        short_url: newURL.suffix
      });

    } catch (err) {
      console.error('Error saving URL: ', err);
      res.status(500).json({ error: 'Failed to save URL' }); 
    }
  });

});

app.get('/api/shorturl/:suffix', async (req, res) => {
  const { suffix } = req.params;

  try {
    const url = await ShortUrl.findOne({ suffix });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.redirect(url.original_url);
  } catch (err) {
    console.error('Error retrieving URL: ', err);
    res.status(500).json({ error: 'Failed to retrieve URL' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
