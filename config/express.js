const express = require('express');
const cors = require('cors');
const fs = require('fs')
const connectionUtils = require('../connection')
const dataHandler = require('../data')
module.exports = () => {
  const app = express();

  app.use(express.urlencoded());

  app.use(express.json());

  app.use(cors());
  
  app.post('/api/postAudio', async (req, res) => {
    const response = await connectionUtils.doRequest(3002, req.body.data)
    const formattedResponse = dataHandler.formatData(response)
    console.log(formattedResponse)
    console.log(formattedResponse.alternatives)
    const recognition = formattedResponse.alternatives[0];
    console.log('Recognized word -> ', recognition.text)
  });

  return app;
};