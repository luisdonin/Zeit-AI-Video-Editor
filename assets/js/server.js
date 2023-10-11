const express = require('express')
const app = express()
const hostname = "localhost"
const cors = require('cors')
const path = require('path')
const ytdl = require('ytdl-core')
const port = 3000

app.use('/bootstrap/css/', express.static(path.join(__dirname, '/../bootstrap/css/')));
app.use('/css/',express.static(path.join(__dirname, '/../css/')));
app.use('/img/',express.static(path.join(__dirname, '/../img/')));
app.use('/js/',express.static(path.join(__dirname, '/../js/')));
app.use('/js/',express.static(path.join(__dirname, '/../bootstrap/js/')));
app.use('/fonts/',express.static(path.join(__dirname, '/../fonts/')));

app.get('/', (req, res) => {res.sendFile('index.html', {'root': __dirname + '/../../'})
});

app.get('/download', (req,res) => {
  var URL = req.query.URL;
  res.json({url: URL});
});

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`)
});