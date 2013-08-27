var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

io.configure(function(){
  io.set('log level', 1);  //tells IO socket to be mostly quiet.
});

// Send current time to all connected clients
var thetime = new Date().toJSON();
function sendTime() {
    thetime = new Date().toJSON();
    //thetime = new Date().valueOf();
    io.sockets.emit('time', { time: thetime });
    console.log("Sent time.");
}
// Send current time at set interval
setInterval(sendTime, 30000);


var rf = function() {
    var fs = require('fs');
    data = fs.readFileSync('the.xml', {encoding: 'utf-8'});
    return data;
}
var sendfileguts = function() {
    io.sockets.emit('fileguts', { fileguts: rf() });
}
function wfsync(towrite) {
    var fs = require('fs');
    fs.writeFileSync("the.xml", towrite);
    console.log("Saved to file, Sync.");
}
function wfcb(towrite) {
    var fs = require('fs');
    fs.writeFile("the.xml", towrite, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Saved to file, A-Sync.");
        }
    });
}


// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    console.log("Somebody connected.");
    socket.emit('welcome', { message: 'Hi' }); //was: socket.emit('welcome', { message: 'Hi', time: new Date().toJSON() });
    sendfileguts();
    
    socket.on('write to file', function(thedata) {
        console.log("Function called: Write to File");
        console.log("Data I just received: " + thedata.data);
        wfsync(thedata.data);  //writes received data to file
        sendfileguts();  //sends back contents of file.
    });
});



app.listen(3000);