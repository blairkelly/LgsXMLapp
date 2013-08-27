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
var xmlDocOrig;
var xmlqueryobjorig;
var bindformactions = function (theticket) {
    var associatedxmlobj = theticket.data('associatedxmlobj');
    theticket.find('.btndiscard').click(function(e) {
        e.preventDefault();
        if($(this).hasClass('btn-danger')) {
            $(this).removeClass('btn-danger');
            $(this).addClass('btn-warning');
            $(this).text("Are you sure?");
            var forlater = $(this);
            setTimeout(function() {
                forlater.removeClass('btn-warning');
                forlater.addClass('btn-danger');
                forlater.text("Discard Journey");
            }, 2222);
        } else if($(this).hasClass('btn-warning')) {
            discardjourney(this);
            console.log("Discarded Journey");
        }
    });

    theticket.find('.imageslocations>.thumb>input').focusout(function () {
        var theval = $(this).val();
        associatedxmlobj.find('images>thumbnail').text(theval);
        //update associated image source.
        theticket.find('.images>.thumb>img').attr('src', imagepath + theval);
    });
    theticket.find('.imageslocations>.enlarged>input').focusout(function () {
        var theval = $(this).val();
        associatedxmlobj.find('images>enlarged').text(theval);
        theticket.find('.images>.enlarged>img').attr('src', imagepath + theval);
    });
    theticket.find('.story').focusout(function () {
        var theval = $(this).val();
        associatedxmlobj.find('story').text(theval);
    });
    theticket.find('.speakersname').focusout(function () {
        var theval = $(this).val();
        associatedxmlobj.find('details>name').text(theval);
    });
    theticket.find('.speakerslocation').focusout(function () {
        var theval = $(this).val();
        associatedxmlobj.find('details>location').text(theval);
    });
}
var applyentrydatatoticket = function(theticket, dataobj) {
    theticket.data('associatedxmlobj', dataobj.associatedxmlobj);
    theticket.find('.images>.thumb>img').attr('src', imagepath + dataobj.thumbfile);
    theticket.find('.images>.enlarged>img').attr('src', imagepath + dataobj.enlargedfile);
    theticket.find('.imageslocations>.thumb>input').val(dataobj.thumbfile);
    theticket.find('.imageslocations>.enlarged>input').val(dataobj.enlargedfile);
    theticket.find('.story').val(dataobj.thestory);
    theticket.find('.speakersname').val(dataobj.thename);
    theticket.find('.speakerslocation').val(dataobj.thelocation);
    theticket.find('.created').text("Created: " + dataobj.datecreated);
    theticket.find('.modified').text("Modified: " + dataobj.datemodified);
}
var pulldata = function (theobj) {
    var dataobj = new Object;
    dataobj.associatedxmlobj = theobj;
    dataobj.thumbfile = theobj.find('images>thumbnail').text();
    dataobj.enlargedfile = theobj.find('images>enlarged').text();
    dataobj.thestory = theobj.find('story').text();
    dataobj.thename = theobj.find('details>name').text();
    dataobj.thelocation = theobj.find('details>location').text();
    dataobj.datecreated = theobj.find('created').text();
    dataobj.datemodified = theobj.find('modified').text();
    return dataobj;
}
var clearentrydata = function (theobj) {
    var createdate = new Date().toJSON();
    theobj.find('images>thumbnail').text('');
    theobj.find('images>enlarged').text('');
    theobj.find('story').text('');
    theobj.find('details>name').text('');
    theobj.find('details>location').text('');
    theobj.find('created').text(createdate);
    theobj.find('modified').text(createdate);
}
var updatedata = function() {
    //this sort of just re-creates
}
var addblankjourney = function () {
    var journeys = xmlqueryobj.find('journeys');
    var sampledataentry = xmlqueryobj.find('journeys>journey').eq(0);
    var cleandataentry = sampledataentry.clone().prependTo(journeys);
    clearentrydata(cleandataentry);
    var tt = $('.tickettemplate .ticket'); //pull tickettemplate
    var th = $('.ticketholder'); //specify ticketholder
    var newticket = tt.clone().prependTo(th);
    newticket.data('associatedxmlobj', cleandataentry);
    newticket.find('.created').text("Created: " + cleandataentry.find('created').text());
    newticket.find('.modified').text("Modified: " + cleandataentry.find('modified').text());
    bindformactions(newticket);
}
var discardjourney = function (thediscardbtn) {
    var theticket = $(thediscardbtn).closest('.ticket');
    var associatedxmlentry = theticket.data('associatedxmlobj');
    associatedxmlentry.remove();
    theticket.remove();
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
        applyentrydatatoticket(newtt, dataobj);
        //bind
        bindformactions(newtt);
    });
}
var loadXML = function (thedata) {
    xml = thedata,
    xmlDoc = $.parseXML( xml ),
    xmlqueryobj = $( xmlDoc );
    //keep an original copy
    xmlDocOrig = $.parseXML( xml );
    xmlqueryobjorig = $( xmlDoc );
    //populate the ticket
    fillticketholder();
    //console.log(xml);
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
    $('.btnaddjourney').click(function(e) {
        e.preventDefault();
        addblankjourney();
        console.log("Add Journey");
    });
});