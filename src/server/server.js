const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

// Server-side will not be used currently
// Client will handle authentication directly from Spotify browser 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/play', function (req, res) {
  return res.send('play')
});

app.get('/pause', function (req, res) {
  return res.send('pause')
});


app.listen(process.env.PORT || 8080);