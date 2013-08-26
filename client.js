/*
var date1 = "2013-08-26T19:15:39.919Z";
var date2 = "2013-08-26T21:31:56.455Z";
var datetocompare1 = new Date(date1).getTime();
var datetocompare2 = new Date(date2).getTime();
*/

var socket = io.connect('//localhost:3000');

socket.on('welcome', function(data) {});

socket.on('time', function(data) {
    //$('#lastsaved').text(data.time);
});

socket.on('fileguts', function(data) {
    $('#lastsaved').text(data.fileguts);
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