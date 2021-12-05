const { spawnSync} = require('child_process');
const vosk = require('vosk')
const fs = require("fs");
const { Readable } = require("stream");
const wav = require("wav");

module.exports.doSpeechRecog = (path) =>  {
  return new Promise(async (resolve, reject) => {
    MODEL_PATH = "model_pt"
    FILE_NAME = "sample.wav"

    if (process.argv.length > 2)
      FILE_NAME = process.argv[2]

    vosk.setLogLevel(0);
    const model = new vosk.Model(MODEL_PATH);

    const wfReader = new wav.Reader();
    const wfReadable = new Readable().wrap(wfReader);

    wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
      if (audioFormat != 1 || channels != 1) {
        console.error("Audio file must be WAV format mono PCM.");
        process.exit(1);
      }
      const rec = new vosk.Recognizer({ model: model, sampleRate: sampleRate });
      rec.setMaxAlternatives(10);
      rec.setWords(true);
      for await (const data of wfReadable) {
        const end_of_speech = rec.acceptWaveform(data);
        if (end_of_speech) {
          console.log(JSON.stringify(rec.result(), null, 4));
        }
      }
      resolve(JSON.stringify(rec.result(), null, 4))
      rec.free();
    });

    fs.createReadStream(FILE_NAME, { 'highWaterMark': 4096 }).pipe(wfReader).on('finish',
      function (err) {
        model.free();
      });
  })
}

module.exports.convertFile = (path) => {
  const files = fs.readdirSync('./');
  files.forEach(file => {
    if (file === 'sample.wav') {
      fs.unlinkSync(file);
    }
  })

  const child = spawnSync("ffmpeg", ['-i', path, 'sample.wav']);
  return child.stdout
}
