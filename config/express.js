const express = require('express');
const cors = require('cors');
const fs = require('fs')

module.exports = () => {
  const app = express();

  app.use(express.urlencoded());

  app.use(express.json());

  app.use(cors());
  
  app.post('/api/postAudio', (req, res) => {
    console.log(req.body);
    fs.writeFileSync('audiSample.txt', req.body.data);
    fs.writeFileSync('file.ogg', Buffer.from(req.body.data.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64'));

    res.send('POST request to the homepage');
  });

  return app;
};