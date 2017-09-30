/* jQuery:true */

$(document).ready(function() {
    var height = ($("#content #player").css('width').substring(0, 3) * 0.5625) + 'px';
    $("#content #player").css('height', height);
});