const express = require('express');
const cors = require('cors');
const connectionUtils = require('../connection')
const dataHandler = require('../data')
const gcloudBucket = require('../gCloudBucket');
module.exports = () => {
  const app = express();

  app.use(express.urlencoded());

  app.use(express.json());

  app.use(cors());
  
  app.post('/api/postAudio', async (req, res) => {
    const response = await connectionUtils.doRequest(3002, req.body.data)
    const formattedResponse = dataHandler.formatData(response)
    const recognition = formattedResponse.alternatives[0];
    console.log('Recognized word -> ', recognition.text)
    const gcloudResponse = gcloudBucket.doSearch(recognition.text);
    console.log('gCloud -> ', gcloudResponse)

    res.send(gcloudResponse);
  });

  return app;
};