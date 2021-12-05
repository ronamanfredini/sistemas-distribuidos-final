module.exports.doSearch = (text) => {
  text = text.trim().replace(' ', '_');
  return 'https://storage.googleapis.com/distributed-systems/' + text + ".png";
}