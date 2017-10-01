/* global $:true io:true Vync:true Handlebars MultiPlayer:true */

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
    })(),
    player: new MultiPlayer("player")
};

/* Page loading */
$(document).ready(function() {
    var height = ($("#content #player").width() * 0.5625) + "px";
    $("#content #player").css("height", height);
    Vync.socket.emit("enter", Vync.lobbyId);
});

/* Remote events */
Vync.socket.on("play", () => Vync.player.play());
Vync.socket.on("pause", () => Vync.player.pause());
Vync.socket.on("seek", (time) => Vync.player.setCurrentTime(time));
Vync.socket.on("setVideo", (platform, videoId) => Vync.player.playback(platform, videoId));
Vync.socket.on("confirmName", (name) => updateOwnName(name));

Vync.socket.on("userupdate", (data) => updateUserlist(data));

/* Local player events */
Vync.player.on("timeupdate", (data) => {
    Vync.socket.emit("timeupdate", data);
});
Vync.player.on("play", () => {
    Vync.socket.emit("play");
});
Vync.player.on("pause", () => {
    Vync.socket.emit("pause");
});
Vync.player.on("buffering", () => {
    Vync.socket.emit("buffering");
});
Vync.player.on("ended", () => {
    Vync.socket.emit("ended");
});
Vync.player.on("ready", () => {
    Vync.socket.emit("ready");
});
Vync.player.on("error", (data) => {
    Vync.socket.emit("error", data);
});

/* Change name dialog */
$("#renameModal").on("show.bs.modal", function(){
    $("#newName").val("");
});

function changeName() {
    if (!$("#newName") || $("#newName").val().trim() == "")
        return;
    var newName = $("#newName").val();
    Vync.socket.emit("changeName", newName);
    $("#renameModal").modal("hide");
}

/* User list update */
function updateOwnName(name) {
    $("#self span").val(name);
}

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