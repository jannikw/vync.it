/* global $:true */

$(document).ready(function() {
    var height = ($("#content #player").css("width").replace("px", "") * 0.5625) + "px";
    $("#content #player").css("height", height);
});