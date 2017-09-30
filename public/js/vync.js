/* global $:true io:true Vync:true */
$(document).ready(function() {
    var height = ($("#content #player").css("width").replace("px", "") * 0.5625) + "px";
    $("#content #player").css("height", height);
});

Vync = {
    socket: io()
};

Vync.socket.on("play", () => this.player.play());
Vync.socket.on("pause", () => this.player.pause());
Vync.socket.on("seek", (time) => this.player.setCurrentTime(time));
Vync.socket.on("setVideo", (platform, videoId) => this.player.playback(platform, videoId));

Vync.socket.on("userupdate", (data) => updateUserlist(data));

function updateUserlist(users) {
    $("#users ul").each(function() {
        var item = getByProperty(users, "id", $(this).id);
        if (item) {
            users.remove(item);
        } else {
            $(this).remove();
        }
    });
    $.each(users, function(item) {
        $("#users ul").append(createUserItem(item));
    });
}

function getByProperty(haystack, property, needle) {
    $.each(haystack, function(value) {
        if (value[property] == needle)
            return value;
    });
}

function createUserItem(user) {
    return "<li id=\"" + user.id + "\" class=\"list-group-item\">" +
                "<span>" + user.name + "</span>" +
                "<i class=\"fa fa-times-circle-o\" aria-hidden=\"true\" title=\"Kick\"></i>" +
            "</li>";
}