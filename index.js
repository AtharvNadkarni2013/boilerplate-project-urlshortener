require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  url: String,
})
const Url = mongoose.model('Url', urlSchema)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  const { url } = req.body;
  const urlObj = new Url({ url })
  urlObj.save((err, data) => {
    if (err) return console.error(err);
    const urlId = urlObj._id;
    return res.json({original_url: url, short_url: urlId})
  })
})

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  Url.findOne({_id: short_url}, (err, urlFound) => {
    res.redirect(urlFound.url)
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
