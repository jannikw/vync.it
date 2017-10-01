/* global $:true */
$(document).ready(function() {
    var top = $("#title h1").height() * 0.625;
    $("#pronunciation").css("top", top + "px");
    $("#pronunciation").show();
});