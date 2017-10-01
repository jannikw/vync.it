/* global $:true */
$(document).ready(function() {
    var top = $("#title h1").height() * 0.61;
    var margintop = parseInt($("#description").css("margin-top").replace("px", ""));
    top += margintop;
    $("#pronunciation").css("top", top + "px");
    $("#pronunciation").show();
});