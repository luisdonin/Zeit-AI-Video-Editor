const express = require('express')
const app = express()
const hostname = "localhost"
const cors = require('cors')
const path = require('path')
const ytdl = require('ytdl-core')
const port = 3000

app.use('/bootstrap/css/', express.static(path.join(__dirname, '/../assets/bootstrap/css/')));
app.use('/css/',express.static(path.join(__dirname, '/../assets/css/')));
app.use('/img/',express.static(path.join(__dirname, '/../assets/img/')));

app.get('/', (req, res) => {
  res.sendFile('index.html', {'root': __dirname + '/../html/'})
});

app.get('/download', (req,res) => {
  var URL = req.query.URL;
  res.json({url: URL});
});


app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`)
});