//var imagepath = "http://lgstogether.local/images/journeys/";
var imagepath = "/images/";

var jsondate = new Date().toJSON();
console.log(jsondate);
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
var xmlqueryobj;
var pulldata = function (theobj) {
    var dataobj = new Object;
    dataobj.thumbfile = theobj.find('images>thumbnail').text();
    dataobj.enlargedfile = theobj.find('images>enlarged').text();
    dataobj.thestory = theobj.find('story').text();
    dataobj.thename = theobj.find('details>name').text();
    dataobj.thelocation = theobj.find('details>location').text();
    dataobj.datecreated = theobj.find('created').text();
    dataobj.datemodified = theobj.find('modified').text();
    return dataobj;
}
var updatedata = function() {
    //this sort of just re-creates
}
var fillticketholder = function () {
    var journey = xmlqueryobj.find( "journeys>journey" );
    var tt = $('.tickettemplate .ticket'); //pull tickettemplate
    var th = $('.ticketholder'); //specify ticketholder
    journey.each(function() {
        //pull information
        var dataobj = pulldata($(this));
        //clone template, append
        var newtt = tt.clone().appendTo(th);
        //populate information
        newtt.data('associatedxmlobj', this);
        newtt.find('.images>.thumb>img').attr('src', imagepath + dataobj.thumbfile);
        newtt.find('.images>.enlarged>img').attr('src', imagepath + dataobj.enlargedfile);
        newtt.find('.imageslocations>.thumb>input').val(dataobj.thumbfile);
        newtt.find('.imageslocations>.enlarged>input').val(dataobj.enlargedfile);
        newtt.find('.story').val(dataobj.thestory);
        newtt.find('.speakersname').val(dataobj.thename);
        newtt.find('.speakerslocation').val(dataobj.thelocation);
        newtt.find('.created').text("Created: " + dataobj.datecreated);
        newtt.find('.modified').text("Modified: " + dataobj.datemodified);
    });
}
var loadXML = function (thedata) {
    xml = thedata,
    xmlDoc = $.parseXML( xml ),
    xmlqueryobj = $( xmlDoc );
    fillticketholder();
}
socket.on('fileguts', function(data) {
    loadXML(data.fileguts);
});

socket.on('error', function() { console.error(arguments) });
socket.on('message', function() { console.log(arguments) });

$(document).ready(function() {
    $('.btnsave').click(function(e) {
        e.preventDefault();
        console.log("Functionality Disconnected.");
    });
});