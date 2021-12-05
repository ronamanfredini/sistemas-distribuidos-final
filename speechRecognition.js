const { spawnSync} = require('child_process');


const vosk = require('vosk')
const fs = require("fs");
const { Readable } = require("stream");
const net = require('net');
const wav = require("wav");
const dataHandler = require('./data')

const server = net.createServer(connection => {
  connection.on('connect', data => {
    console.log(`close ${who}`)
  })

  connection.on('error', data => {
    console.log(`error ${who}`)
  })
  connection.on('end', data => {
  })

  connection.on('data', async data => {
    const formattedData = dataHandler.formatData(data);
    fs.writeFileSync('file.ogg', Buffer.from(formattedData.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64'));
    const convertedFileResult = await convertFile('file.ogg');
    console.log('convert,', convertedFileResult)

    const recogResponse = await doSpeechRecog('file.ogg')
    console.log('recog,', recogResponse)

    connection.write(recogResponse)
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
})


function doSpeechRecog(path) {
  return new Promise(async (resolve, reject) => {
    MODEL_PATH = "model_pt"
    FILE_NAME = "sample.wav"

    if (!fs.existsSync(MODEL_PATH)) {
      console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
      process.exit()
    }

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
      console.log(JSON.stringify(rec.finalResult(rec), null, 4));
      rec.free();
    });

    fs.createReadStream(FILE_NAME, { 'highWaterMark': 4096 }).pipe(wfReader).on('finish',
      function (err) {
        model.free();
      });
  })
}



function convertFile(path) {
  const files = fs.readdirSync('./');
  files.forEach(file => {
    if (file === 'sample.wav') {
      fs.unlinkSync(file);
    }
  })

  const child = spawnSync("ffmpeg", ['-i', path, 'sample.wav']);
  return child.stdout
}