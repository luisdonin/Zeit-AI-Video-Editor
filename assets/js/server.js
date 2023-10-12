const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const ytdl = require('ytdl-core')
const fs = require('fs')

const port = 3000
const hostname = "localhost"

app.use('/bootstrap/css/', express.static(path.join(__dirname, '/../bootstrap/css/')));
app.use('/css/',express.static(path.join(__dirname, '/../css/')));
app.use('/img/',express.static(path.join(__dirname, '/../img/')));
app.use('/js/',express.static(path.join(__dirname, '/../js/')));
app.use('/js/',express.static(path.join(__dirname, '/../bootstrap/js/')));
app.use('/fonts/',express.static(path.join(__dirname, '/../fonts/')));

app.get('/', (req, res) => {res.sendFile('index.html', {'root': __dirname + '/../../'})
});

app.get('/download', (req,res) => {
  const videoURL = req.query.URL;
  const videoFormat = "mp4";
  const videoQuality = "1080p"

  ytdl.getInfo(videoURL).then(info => {
    fs.writeFile('./infos.txt', info.format.qualityLabel, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });

  res.header('Content-Disposition', `attachment; filename="video.${videoFormat}"`);
  const videoStream = ytdl(videoURL, { format: videoFormat, quality: videoQuality });
  const videoFilePath = "../../videos/inputs/video.mp4";

  videoStream.pipe(fs.createWriteStream(videoFilePath));

  videoStream.on('end', () => {
    console.log("Download finished");
    console.log("Saved to ${videoFilePath}");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`)
});