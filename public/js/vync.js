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

/* Page loading */
$(document).ready(function() {
    var height = ($("#content #player").width() * 0.5625) + "px";
    $("#content #player").css("height", height);
    Vync.socket.emit("enter", Vync.lobbyId);
});

/* Remote events */
Vync.socket.on("play", () => this.player.play());
Vync.socket.on("pause", () => this.player.pause());
Vync.socket.on("seek", (time) => this.player.setCurrentTime(time));
Vync.socket.on("setVideo", (platform, videoId) => this.player.playback(platform, videoId));
Vync.socket.on("confirmName", (name) => updateOwnName(name));

Vync.socket.on("userupdate", (data) => updateUserlist(data));

/* Local player events */
this.player.on("timeupdate", (data) => {
    Vync.socket.emit("timeupdate", data);
});
this.player.on("play", () => {
    Vync.socket.emit("play");
});
this.player.on("pause", () => {
    Vync.socket.emit("pause");
});
this.player.on("buffering", () => {
    Vync.socket.emit("buffering");
});
this.player.on("ended", () => {
    Vync.socket.emit("ended");
});
this.player.on("ready", () => {
    Vync.socket.emit("ready");
});
this.player.on("error", (data) => {
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