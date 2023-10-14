const server_settings = require('./common.js');
const downloader = require('./server_downloader.js');
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const fs = require('fs')

app.use('/bootstrap/css/', express.static(path.join(__dirname, '/../bootstrap/css/')));
app.use('/css/',express.static(path.join(__dirname, '/../css/')));
app.use('/img/',express.static(path.join(__dirname, '/../img/')));
app.use('/js/',express.static(path.join(__dirname, '/../js/')));
app.use('/js/',express.static(path.join(__dirname, '/../bootstrap/js/')));
app.use('/fonts/',express.static(path.join(__dirname, '/../fonts/')));

app.get('/', (req, res) => {
	res.sendFile('index.html', {'root': __dirname + '/../../'});
});

app.get('/download', async (req,res) => {
	const videoURL = req.query.URL;
	const videoFormatPredefined = "mp4";
	const audioFormatPredefined = "mp3";
	const savePath = "../../videos/inputs/";

	console.log("Donwloading video.....");

	try {
		const {videoTitle, mergedFilePath} = await downloader.downloadVideo(videoURL, savePath, videoFormatPredefined, audioFormatPredefined);
		console.log("Sending video.....");
		console.log(mergedFilePath)
		console.log(videoTitle)
		res.download(mergedFilePath, videoTitle + '.mp4', (err) => {
			if(err === undefined){
				console.log("Video sent successfully");
			} else {
				console.log("Error sending video");
				console.log(err);
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});



app.listen(server_settings.port, () => {
  	console.log(`Server listening at http://${server_settings.hostname}:${server_settings.port}`)
});