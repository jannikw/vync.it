/* global $:true io:true Vync:true Handlebars */

Vync = {
    lobbyId: window.location.pathname.split("/")[2],
    socket: io(),
    templates: (() => {
        function load(id) {
            let source = $("#" + id).html();
            return Handlebars.compile(source);
        }

        return {
            user: load("template-user")
        };
    })()
};

$(document).ready(function() {
    var height = ($("#content #player").width() * 0.5625) + "px";
    $("#content #player").css("height", height);
    Vync.socket.emit("enter", Vync.lobbyId);
});

Vync.socket.on("play", () => this.player.play());
Vync.socket.on("pause", () => this.player.pause());
Vync.socket.on("seek", (time) => this.player.setCurrentTime(time));
Vync.socket.on("setVideo", (platform, videoId) => this.player.playback(platform, videoId));

Vync.socket.on("userupdate", (data) => updateUserlist(data));

function updateUserlist(users) {
    $("#users ul li").each(function() {
        var item = getByProperty(users, "id", $(this).attr("id"));
        if (item) {
            $(this).val(item.name);
            users.remove(item);
        } else {
            $(this).remove();
        }
    });
    $.each(users, function(index) {
        var item = users[index];
        $("#users ul").append(Vync.templates.user(item));
    });
}

function getByProperty(haystack, property, needle) {
    $.each(haystack, function(index, value) {
        if (value && value.id == needle)
            return value;
    });
}