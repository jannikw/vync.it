/* global $:true */

var leftScrolled = 0;

function scrollPlaylistLeft() {
    if (leftScrolled > 0) {
        var nextFirst = $("#playlist-scroll img")[--leftScrolled];
        $("#playlist-scroll").scrollLeft(nextFirst.offsetLeft);
    }
}

function scrollPlaylistRight() {
    var element = $("#playlist-scroll")[0];
    var scrollPercent = 100 * element.scrollLeft / (element.scrollWidth - element.clientWidth);
    if (scrollPercent < 100) {
        var nextFirst = $("#playlist-scroll img")[++leftScrolled];
        $("#playlist-scroll").scrollLeft(nextFirst.offsetLeft);
    }
}