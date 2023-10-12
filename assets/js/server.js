const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const ytdl = require('ytdl-core')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')

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


	ytdl.getInfo(videoURL).then(info => {
    	// gets all the available formats up to 1080p
    	const videoFormats = info.formats.filter(format => 
        		format.hasVideo && 
        	(
        		format.qualityLabel === "1080p" || 
        		format.qualityLabel === "720p" || 
        		format.qualityLabel === "480p" || 
        		format.qualityLabel === "360p" || 
        		format.qualityLabel === "240p" || 
        		format.qualityLabel === "144p"
        	));
    
    	const audioFormats = info.formats.filter(format => format.hasAudio);

    	const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' , format: audioFormatPredefined });
    	// downloads the highest available format up to 1080p
    	const videoFormat = ytdl.chooseFormat(videoFormats, { quality: 'highestvideo' , format: videoFormatPredefined });
    
    	const videoStream = ytdl(videoURL, { format: videoFormat });
    	const audioStream = ytdl(videoURL, { format: audioFormat });

    	videoStream.pipe(fs.createWriteStream(videoFilePath));
    	audioStream.pipe(fs.createWriteStream(audioFilePath));

    	let finishedStreams = 0;

    	audioStream.on('end', () => {
    		console.log("Audio download finished");
    		console.log(`Saved to '${audioFilePath}'`);
    		finishedStreams++;
    		if (finishedStreams === 2) {
    			mergeAudioAndVideo();
    		}
    	});

    	videoStream.on('end', () => {
    		console.log("Video download finished");
    		console.log(`Saved to '${videoFilePath}'`);
    		finishedStreams++;
    		if (finishedStreams === 2) {
    			mergeAudioAndVideo();
    		}
    	});

    	const mergeAudioAndVideo = () => {
			console.log("Merging audio and video.....")
    		ffmpeg()
    			.input(audioFilePath)
    	    	.input(videoFilePath)
    	    	.output(mergedFilePath)
    	    	.videoCodec('libx264')
    	    	.audioCodec('aac')
    	    	.on('end', () => {
    	    		console.log(`Finished merging audio and video, saved to '${mergedFilePath}'`);
    	    	})
    	    	.on('error', (err) => {
    	    		console.error(err);
    	    	})
    	    	.run();
    	};	
	
    	videoStream.on('error', (err) => {
    		console.error(err);
    	});
  	}).catch(err => {
    	console.error(err);
    });

  	res.header('Content-Disposition', `attachment; filename="video.mp4"`);
});

app.listen(port, () => {
  	console.log(`Example app listening at http://${hostname}:${port}`)
});