const downloader = require('./server_downloader.js');
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

const port = 3000
const hostname = "localhost"

app.use('/bootstrap/css/', express.static(path.join(__dirname, '/../bootstrap/css/')));
app.use('/css/',express.static(path.join(__dirname, '/../css/')));
app.use('/img/',express.static(path.join(__dirname, '/../img/')));
app.use('/js/',express.static(path.join(__dirname, '/../js/')));
app.use('/js/',express.static(path.join(__dirname, '/../bootstrap/js/')));
app.use('/fonts/',express.static(path.join(__dirname, '/../fonts/')));

app.get('/', (req, res) => {res.sendFile('index.html', {'root': __dirname + '/../../'})});

app.get('/download', (req,res) => {
	const videoURL = req.query.URL;
	const videoFormatPredefined = "mp4";
	const audioFormatPredefined = "mp3";
	const audioFilePath = "../../videos/inputs/audio.mp3";
	const videoFilePath = "../../videos/inputs/video.mp4";
	const mergedFilePath = "../../videos/inputs/merged.mp4";

	downloader.downloadVideo(videoURL, videoFilePath, audioFilePath, mergedFilePath, videoFormatPredefined, audioFormatPredefined);

  	res.header('Content-Disposition', `attachment; filename="video.mp4"`);
});



app.listen(port, () => {
  	console.log(`Server listening at http://${hostname}:${port}`)
});