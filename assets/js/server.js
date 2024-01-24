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




// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define the navbar as a separate EJS file

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../public')));
app.get('/', (req, res) => {res.sendFile('index.html', {'root': __dirname + '/../../'})});

// Serve the index.html file when the user navigates to the root URL


// Serve the about.html file when the user navigates to the /about URL
app.get('/about', (req, res) => {
    res.sendFile('about.html', {'root': __dirname + '/../../'});
});

app.get('/index', (req, res) => {
    res.sendFile('index.html', {'root': __dirname + '/../../'});
});

// Serve the contact.html file when the user navigates to the /contact URL
app.get('/contact', (req, res) => {
    res.sendFile('contact.html', {'root': __dirname + '/../../'});
});

// Serve the integrations.html file when the user navigates to the /integrations URL
app.get('/integrations', (req, res) => {
    res.sendFile('integrations.html', {'root': __dirname + '/../../'});
});

// Serve the pricing.html file when the user navigates to the /pricing URL
app.get('/pricing', (req, res) => {
    res.sendFile('pricing.html', {'root': __dirname + '/../../'});
});

// Serve the contacts.html file when the user navigates to the /contacts URL
app.get('/contacts', (req, res) => {
    res.sendFile('contacts.html', {'root': __dirname + '/../../'});
});

// Serve the login.html file when the user navigates to the /login URL
app.get('/login', (req, res) => {
    res.sendFile('login.html', {'root': __dirname + '/../../'});
});

// Serve the signup.html file when the user navigates to the /signup URL
app.get('/dashboard', (req, res) => {
    res.sendFile('dashboard.html', {'root': __dirname + '/../../'});
});

let videos = [];

app.get('/download', async (req,res) => {
	const videoURL = req.query.URL;
	const cutDuration = req.query.Duration;
	const videoFormatPredefined = "mp4";
	const audioFormatPredefined = "mp3";
	const savePath = "../../videos/inputs/";

	console.log("Donwloading video.....");

	try {
		const {videoTitle, mergedFilePath} = await downloader.downloadVideo(videoURL, savePath, videoFormatPredefined, audioFormatPredefined);
		console.log("Cutting video.....");
		console.log(mergedFilePath);
		console.log(videoTitle);

		ffmpeg.ffprobe(mergedFilePath, (err, metadata) => {
			if(err === null)
			{
				const duracaoDoVideo = metadata.format.duration;

				const amountOfCuts = Math.ceil(duracaoDoVideo / cutDuration);

				fs.mkdirSync(mergedFilePath + "_cuts", (err) => {
					if(err === undefined){
						console.log("Folder created successfully");
					} else {
						console.log("Error creating folder");
						console.log(err);
					}
				});

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
						//	video.push(cutFilePath)
							res.download(mergedFilePath, videoTitle + '.mp4', (err) => {
								if(err === undefined){
									console.log("Video sent successfully");
								} else {
									console.log("Error sending video");
									console.log(err);
								}
							});
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

/*app.get('/dashboard', (req, res) =>{
	 // Send the video paths to the client
	res.json(videos)
})
*/
app.listen(server_settings.port, () => {
  	console.log(`Server listening at http://${server_settings.hostname}:${server_settings.port}`)
});