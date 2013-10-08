//var imagepath = "http://bkelly.klick.com/images/journeys/";
var imagepath = "http://lgstogether.local/images/journeys/";
//var imagepath = "/images/";


var hasbeenmodified = false;
var jsondate = new Date().toJSON();
console.log(jsondate);
/*
var date1 = "2013-08-26T19:15:39.919Z";
var date2 = "2013-08-26T21:31:56.455Z";
var datetocompare1 = new Date(date1).getTime();
var datetocompare2 = new Date(date2).getTime();
*/

var generateuniqueid = function(objs_to_compare) {
    var thekey;
    var isunique = false;
    while(!isunique) {
        thekey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        isunique = true;
        objs_to_compare.each(function() {
            var keytocheck = $(this).find('uid');
            if( keytocheck == thekey ) {
                isunique = false;
            }
        });
    }
    return thekey;
}
var makeboolean = function (v) {
    if(v == "true" || v == "1") {
        n = true;
    } else if (v == "false" || !v || v == "0") {
        n = false;
    }
    return n;
}

var socket = io.connect('//localhost:3001');
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
var ismodded = function(te, associatedticket) {
    var te_val = te.text();
    var theTargetXMLobj = te.closest('journey');
    var theuid = theTargetXMLobj.find('uid').text();
    var theOriginalXMLobj;
    xmlqueryobjorig.find('journeys>journey').each(function() {
        var uid_orig = $(this).find('uid').text();
        if(uid_orig == theuid) {
            theOriginalXMLobj = $(this);
        }
    });
    var newdate = new Date().toJSON();
    if(!associatedticket.hasClass('new-entry')) {
        var to_val = theOriginalXMLobj.find(te.selector).text();
        if(te_val != to_val) {
            //modified
            theTargetXMLobj.find('modified').text(newdate);
            associatedticket.find('.modified').text("Modified: " + newdate);
            hasbeenmodified = true;
        }
    } else {
        hasbeenmodified = true;
    }
    //console.log("originl val: " + to_val);
    //console.log("the new val: " + te_val);
}
var bindformactions = function (theticket) {
    var associatedxmlobj = theticket.data('associatedxmlobj');
    theticket.click(function() {
        if($(this).hasClass('collapsed')) {
            $(this).removeClass('collapsed');
        }
    });
    theticket.find('.btnhide').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        theticket.addClass('collapsed');
    });
    theticket.find('.btndiscard').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var wt = $(this).data('warningtext');
        var ot = $(this).text();
        if($(this).hasClass('btn-danger')) {
            $(this).removeClass('btn-danger');
            $(this).addClass('btn-warning');
            $(this).text(wt);
            var forlater = $(this);
            setTimeout(function() {
                forlater.removeClass('btn-warning');
                forlater.addClass('btn-danger');
                forlater.text(ot);
            }, 1111);
        } else if($(this).hasClass('btn-warning')) {
            discardjourney(this);
            dosave();
            console.log("Discarded Journey");
        }
    });
    theticket.find('.imageslocations>.thumb>input').focusout(function () {
        var theval = $(this).val();
        $(this).data('ao').text(theval);
        theticket.find('.images>.thumb>img').attr('src', imagepath + theval);
        ismodded($(this).data('ao'), theticket);
    });
    theticket.find('.imageslocations>.enlarged>input').focusout(function () {
        var theval = $(this).val();
        $(this).data('ao').text(theval);
        theticket.find('.images>.enlarged>img').attr('src', imagepath + theval);
        ismodded($(this).data('ao'), theticket);
    });
    theticket.find('.story').focusout(function () {
        var theval = $(this).val();
        $(this).data('ao').text(theval);
        ismodded($(this).data('ao'), theticket);
    });
    theticket.find('.speakersname').focusout(function () {
        var theval = $(this).val();
        $(this).data('ao').text(theval);
        theticket.find('.ticketpreview .name').text(theval);
        ismodded($(this).data('ao'), theticket);
    });
    theticket.find('.speakerslocation').focusout(function () {
        var theval = $(this).val();
        $(this).data('ao').text(theval);
        theticket.find('.ticketpreview .location').text(theval);
        ismodded($(this).data('ao'), theticket);
    });
    theticket.find('.notexpandable').click(function () {
        var theval = $(this).prop('checked');
        $(this).data('ao').text(theval);
        ismodded($(this).data('ao'), theticket);
    });
    theticket.find('.isdisabled').click(function () {
        var theval = $(this).prop('checked');
        $(this).data('ao').text(theval);
        ismodded($(this).data('ao'), theticket);
    });
}
var applyentrydatatoticket = function(theticket, dataobj) {
    theticket.data('associatedxmlobj', dataobj.associatedxmlobj);
    theticket.find('.images>.thumb>img').attr('src', imagepath + ( (dataobj.thumbfile.text() != '') ? dataobj.thumbfile.text() : 'unspecified-thumbnail.jpg' ) ).data('ao', dataobj.thumbfile);
    theticket.find('.images>.enlarged>img').attr('src', imagepath + ( (dataobj.enlargedfile.text() != '') ? dataobj.enlargedfile.text() : 'unspecified-enlarged.jpg' )).data('ao', dataobj.enlargedfile);
    theticket.find('.imageslocations>.thumb>input').val(dataobj.thumbfile.text()).data('ao', dataobj.thumbfile);
    theticket.find('.imageslocations>.enlarged>input').val(dataobj.enlargedfile.text()).data('ao', dataobj.enlargedfile);
    theticket.find('.story').val(dataobj.thestory.text()).data('ao', dataobj.thestory);
    theticket.find('.speakersname').val(dataobj.thename.text()).data('ao', dataobj.thename);
    theticket.find('.speakerslocation').val(dataobj.thelocation.text()).data('ao', dataobj.thelocation);
    theticket.find('.created').html("Created: " + dataobj.datecreated.text()).data('ao', dataobj.datecreated);
    theticket.find('.modified').html("Modified: " + dataobj.datemodified.text()).data('ao', dataobj.datemodified);
    theticket.find('.notexpandable').prop('checked', makeboolean(dataobj.notexpandable.text())).data('ao', dataobj.notexpandable);
    theticket.find('.isdisabled').prop('checked', makeboolean(dataobj.isdisabled.text())).data('ao', dataobj.isdisabled);
    theticket.attr('id', dataobj.uid.text());
    theticket.find('.ticketpreview .name').html(dataobj.thename.text()).data('ao', dataobj.thename);
    theticket.find('.ticketpreview .location').html(dataobj.thelocation.text() || '&nbsp;').data('ao', dataobj.thelocation);
}
var pulldata = function (theobj) {
    var dataobj = new Object;
    dataobj.associatedxmlobj = theobj;
    dataobj.thumbfile = theobj.find('images>thumbnail');
    dataobj.enlargedfile = theobj.find('images>enlarged');
    dataobj.thestory = theobj.find('story');
    dataobj.thename = theobj.find('details>name');
    dataobj.thelocation = theobj.find('details>location');
    dataobj.notexpandable = theobj.find('options>notexpandable');
    dataobj.isdisabled = theobj.find('options>disabled');
    dataobj.datecreated = theobj.find('created');
    dataobj.datemodified = theobj.find('modified');
    dataobj.uid = theobj.find('uid');
    return dataobj;
}
var clearentrydata = function (theobj, uniqueid) {
    var createdate = new Date().toJSON();
    theobj.associatedxmlobj = theobj;
    theobj.find('images>thumbnail').text('');
    theobj.find('images>enlarged').text('');
    theobj.find('story').text('');
    theobj.find('details>name').text('');
    theobj.find('details>location').text('');
    theobj.find('options>notexpandable').text('false');
    theobj.find('options>isdisabled').text('false');
    theobj.find('created').text(createdate);
    theobj.find('modified').text(createdate);
    theobj.find('uid').text(uniqueid);
}
var addblankjourney = function () {
    var journeys = xmlqueryobj.find('journeys');
    var xmljourneyobjs = xmlqueryobj.find('journeys>journey');
    var sampledataentry = xmlqueryobj.find('template>journey').eq(0);
    var cleandataentry = sampledataentry.clone().prependTo(journeys);
    var uniqueid = generateuniqueid(xmljourneyobjs);
    clearentrydata(cleandataentry, uniqueid);
    var tt = $('.tickettemplate .ticket'); //pull tickettemplate
    var th = $('.ticketholder'); //specify ticketholder
    var newticket = tt.clone().prependTo(th);
    var dataobj = pulldata(cleandataentry);
    newticket.addClass('new-entry');
    newticket.removeClass('collapsed');
    applyentrydatatoticket(newticket, dataobj);
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
    th.empty();
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
    $('.numberofjourneys').text(journey.length + " journey(s).");
}
var loadXML = function (thedata) {
    xml = thedata,
    xmlDoc = $.parseXML( xml ),
    xmlqueryobj = $( xmlDoc );
    //keep an original copy
    xmlDocOrig = $.parseXML( xml );
    xmlqueryobjorig = $( xmlDocOrig );
    //populate the ticket
    fillticketholder();
}
socket.on('fileguts', function(data) {
    loadXML(data.fileguts);
});
socket.on('saved', function() { 
    $('.btnsave').removeAttr('disabled');
});
socket.on('error', function() { console.error(arguments) });
socket.on('message', function() { console.log(arguments) });

var xmlerize = function(xmlData) {
    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else {
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}
var dosave = function() {
    setTimeout(function () {
        var xmlstring = xmlerize(xmlDoc);
        hasbeenmodified = false;
        socket.emit('write to file', {data: xmlstring});
    }, 111);
}
$(document).ready(function() {
    $('.btnsave').click(function(e) {
        e.preventDefault();
        $('.btnsave').attr('disabled', 'disabled');
        dosave();
    });
    $('.btnaddjourney').click(function(e) {
        e.preventDefault();
        addblankjourney();
        console.log("Added Journey");
    });
    $('.btnexpandall').click(function(e) {
        e.preventDefault();
        var thisbtn = $(this);
        if(thisbtn.hasClass('expanded')) {
            $('.ticketholder').find('.ticket').each(function () {
                $(this).addClass('collapsed');
            });
            thisbtn.removeClass('expanded').text(thisbtn.data('originaltext'));
        } else {
            $('.ticketholder').find('.ticket').each(function () {
                $(this).removeClass('collapsed');
            });
            thisbtn.addClass('expanded').data('originaltext', thisbtn.text()).text(thisbtn.data('alttext'));
        }
        
    });

    document.addEventListener("keydown", function(e) {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        $('.btnsave').focus();
        $('.btnsave').attr('disabled', 'disabled');
        dosave();
      }
    }, false);

});

//setInterval(dosave, 10000);