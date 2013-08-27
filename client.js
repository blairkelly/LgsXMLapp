var imagepath = "http://lgstogether.local/images/";

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

//globalize values
var xml;
var xmlDoc;
var $xml;
var loadXML = function (thedata) {
    xml = thedata,
    xmlDoc = $.parseXML( xml ),
    $xml = $( xmlDoc );
    testxml();
}
socket.on('fileguts', function(data) {
    loadXML(data.fileguts);
});

socket.on('error', function() { console.error(arguments) });
socket.on('message', function() { console.log(arguments) });

var testxml = function () {
    $name = $xml.find( "name" );
    var nametext = $name.text();
    $('.speakersname').val(nametext);
    console.log("The name is: " + nametext);
}

$(document).ready(function() {
    $('.btnsave').click(function(e) {
        e.preventDefault();
        $('.journeysholder').toggleClass('received');
        console.log("Functionality Disconnected.");
    });
});