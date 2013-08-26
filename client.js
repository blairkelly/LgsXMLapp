var socket = io.connect('//localhost:3000');

socket.on('welcome', function(data) {});

socket.on('time', function(data) {
    $('#lastsaved').attr('placeholder', data.time);
});
socket.on('fileguts', function(data) {
    $('#lastsaved').attr('placeholder', data.fileguts);
    $('.lastsavedholder').addClass('received');
});

socket.on('error', function() { console.error(arguments) });
socket.on('message', function() { console.log(arguments) });

$(document).ready(function() {
    $('.btnsave').click(function(e) {
        e.preventDefault();
        var theval = $('#userinput').val();
        if(theval) {
            socket.emit('write to file', {data: theval});
        }
    });
});
