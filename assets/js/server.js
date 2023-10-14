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




// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define the navbar as a separate EJS file

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../public')));
app.get('/', (req, res) => {res.sendFile('index.html', {'root': __dirname + '/../../pages/'})});

// Serve the index.html file when the user navigates to the root URL


// Serve the about.html file when the user navigates to the /about URL
app.get('/about', (req, res) => {
    res.sendFile('about.html', {'root': __dirname + '/../../pages/'});
});

app.get('/index', (req, res) => {
    res.sendFile('index.html', {'root': __dirname + '/../../pages/'});
});

// Serve the contact.html file when the user navigates to the /contact URL
app.get('/contact', (req, res) => {
    res.sendFile('contact.html', {'root': __dirname + '/../../pages/'});
});

// Serve the integrations.html file when the user navigates to the /integrations URL
app.get('/integrations', (req, res) => {
    res.sendFile('integrations.html', {'root': __dirname + '/../../pages/'});
});

// Serve the pricing.html file when the user navigates to the /pricing URL
app.get('/pricing', (req, res) => {
    res.sendFile('pricing.html', {'root': __dirname + '/../../pages/'});
});

// Serve the contacts.html file when the user navigates to the /contacts URL
app.get('/contacts', (req, res) => {
    res.sendFile('contacts.html', {'root': __dirname + '/../../pages/'});
});

// Serve the login.html file when the user navigates to the /login URL
app.get('/login', (req, res) => {
    res.sendFile('login.html', {'root': __dirname + '/../../pages/'});
});

// Serve the signup.html file when the user navigates to the /signup URL
app.get('/signup', (req, res) => {
    res.sendFile('signup.html', {'root': __dirname + '/../../pages/'});
});



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

 
