const server_settings = require('./common.js');
const downloader = require('./server_downloader.js');
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg');

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
	const cutDuration = req.query.Duration;
	const videoFormatPredefined = "mp4";
	const audioFormatPredefined = "mp3";
	const savePath = "../../videos/inputs/";

	console.log("Donwloading video.....");

	// downloads the video and audio and merges them
	try { 
		const {videoTitle, mergedFilePath} = await downloader.downloadVideo(videoURL, savePath, videoFormatPredefined, audioFormatPredefined);
		console.log("Cutting video.....");
		console.log(mergedFilePath);
		console.log(videoTitle);

		ffmpeg.ffprobe(mergedFilePath, (err, metadata) => {
			if(err === null)
			{
				const duracaoDoVideo = metadata.format.duration;

				let cutsSent = 0;

				const amountOfCuts = Math.ceil(duracaoDoVideo / cutDuration);

				if(!fs.existsSync(mergedFilePath + "_cuts"))
				{
					fs.mkdirSync(mergedFilePath + "_cuts", (err) => {
						if(err === undefined){
							console.log("Folder created successfully");
						} else {
							console.log("Error creating folder");
							console.log(err);
						}
					});
				}

				for (let i = 0; i < amountOfCuts; i++) {
					let startTime = i * cutDuration;
					let endTime = (i + 1) * cutDuration;

					if(endTime > duracaoDoVideo){
						endTime = duracaoDoVideo;
					}

					const cutFilePath = mergedFilePath + "_cuts/" + videoTitle + "_cut_" + i + ".mp4";

					ffmpeg(mergedFilePath)
						.setStartTime(startTime)
						.setDuration(endTime - startTime)
						.output(cutFilePath)
						.on('end', () => {
							console.log("Cut finished");
							console.log(`Saved to '${cutFilePath}'`);
							console.log(`Sending video ${i} to client`)
							
							res.setHeader(`Content-Type`, `video/mp4`);
							res.setHeader(`Content-Disposition`, `attachment; filename="${videoTitle}_cut_${i}.mp4"`);

							const cutFileStream = fs.createReadStream(cutFilePath);
							
							cutFileStream.pipe(res, {end: false});

							cutFileStream.on('end', () => {
								console.log(`Video ${i} sent successfully`);
								cutsSent++;
								if(cutsSent === amountOfCuts){
									res.end();
								}
							});

							cutFileStream.on('error', (err) => {
								console.log("Error sending video");
								console.log(err);
							});

							// res.download(mergedFilePath, videoTitle + '.mp4', (err) => {
							// 	if(err === undefined){
							// 		console.log("Video sent successfully");
							// 	} else {
							// 		console.log("Error sending video");
							// 		console.log(err);
							// 	}
							// });
						})
						.on('error', (err) => {
							console.log("Error cutting video");
							console.log(err);
						})
						.run();
				}
			} else {
				console.log("Error reading video information");
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