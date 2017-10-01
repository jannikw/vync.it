/* global $:true Vync:true */

setHeight();

function setHeight() {
    var height = ($("#playlist").width() - 28) / 4 * 9 / 16;
    height = height * 1.03;
    $("#playlist").height(height);
}

var leftScrolled = 0;
function scrollPlaylistLeft() {
    if (leftScrolled > 0) {
        var nextFirst = $("#playlist-scroll .upcoming")[--leftScrolled];
        $("#playlist-scroll").scrollLeft(nextFirst.offsetLeft);
    }
}

function scrollPlaylistRight() {
    var element = $("#playlist-scroll")[0];
    var scrollPercent = 100 * element.scrollLeft / (element.scrollWidth - element.clientWidth);
    if (scrollPercent < 100) {
        var nextFirst = $("#playlist-scroll .upcoming")[++leftScrolled];
        console.log(nextFirst);
        $("#playlist-scroll").scrollLeft(nextFirst.offsetLeft);
    }
}

function submitNewUrl() {
    var url = $("#addurl input").val();
    if (url.trim() != "") {
        Vync.socket.emit("addvideo", url.trim());
        $("#addurl input").val("");
    }
}