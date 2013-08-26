var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

function wf(thetime) {
    var fs = require('fs');
    fs.writeFile("the.xml", "The date is: " + thetime, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Saved.");
        }
    });
}

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

io.configure(function(){
  io.set('log level', 1);  //tells IO socket to be mostly quiet.
});

// Send current time to all connected clients
function sendTime() {
    var thetime = new Date().toJSON();
    io.sockets.emit('time', { time: thetime });
    wf(thetime);  //writes "thetime" to file.
}

// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Hi there.', time: new Date().toJSON() });
    //socket.on('i am client', console.log);
    console.log("Somebody connected.");
});

app.listen(3000);