const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const Watcher = require('./watcher');

// Serve static files from the /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at the root URL
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.get('/log', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let watcher = new Watcher("test.log");

watcher.start();

io.on('connection', function (socket) {
    console.log("new connection established:" + socket.id);

    watcher.on("process", function process(data) {
        socket.emit("update-log", data);
    });
    let data = watcher.getLogs();
    socket.emit("init", data);
});

http.listen(3000, function () {
    console.log('listening on localhost:3000');
});
