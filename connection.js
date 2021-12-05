const net = require('net')
const dataHandler = require('./data')

module.exports.doRequest = (port, data) => new Promise((resolve, reject) => {
  const client = net.createConnection({ port }, () => {
    client.write(dataHandler.encodeData(data))
  })

  client.on('data', (data) => {
    resolve(data.toString())
    client.end()
  })

  client.on('end', () => {})
})