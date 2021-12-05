const fs = require("fs");
const net = require('net');
const dataHandler = require('./data');
const speechRecognition = require('./speechRecognition');

const server = net.createServer(connection => {
  connection.on('connect', () => {
    console.log(`close ${who}`)
  })

  connection.on('error', () => {
    console.log(`error ${who}`)
  })
  connection.on('end', () => {
    console.log('Connection ended')
  })

  connection.on('data', async data => {
    const formattedData = dataHandler.formatData(data);
    fs.writeFileSync('file.ogg', Buffer.from(formattedData.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64'));
    const convertedFileResult = await speechRecognition.convertFile('file.ogg');
    console.log('convert -> ', convertedFileResult);

    const recogResponse = await speechRecognition.doSpeechRecog('file.ogg');
    console.log('recog -> ', recogResponse)
    connection.write(recogResponse);
  })
})

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(3002, HOST);
    }, 1000);
  }
});

server.listen({
  host: 'localhost',
  port: 3002,
  exclusive: true
});
