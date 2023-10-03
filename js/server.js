const express = require('express')
const app = express()
const hostname = "localhost"
const cors = require('cors')
const ytdl = require('ytdl-core')
const port = 3000

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




// const http = require('node:http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// }); 