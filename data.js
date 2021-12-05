module.exports.formatData = buffer => {
  if (typeof buffer === 'string') {
      return JSON.parse(buffer)
  }
  try {
      const str = new TextDecoder().decode(buffer)
      return JSON.parse(str)
  } catch(err) {
      return buffer
  }
  
}
module.exports.encodeData = data => JSON.stringify(data)