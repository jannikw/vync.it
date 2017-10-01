/* global $:true io:true Vync:true Handlebars MultiPlayer Providers Q */

Vync = {
    lobbyId: window.location.pathname.split("/")[2],
    socket: io(),
    templates: (() => {
        function load(id) {
            let source = $("#" + id).html();
            return Handlebars.compile(source);
        }

        return {
            user: load("template-user"),
            playlistentry: load("template-playlist-entry")
        };
    })(),
    player: (() => {
        let player = new MultiPlayer("player");

        player.addProvider("youtube", Providers.youtube);
        player.addProvider("vimeo", Providers.vimeo);

        return player;
    })(),
};

/* Page loading */
$(document).ready(function() {
    var height = ($("#content #player").width() * 0.5625) + "px";
    $("#content #player").css("height", height);
    Vync.socket.emit("enter", Vync.lobbyId);
});

/* Remote events */
Vync.socket.on("play", () => Vync.player.play().done());
Vync.socket.on("pause", () => Vync.player.pause().done());
Vync.socket.on("setCurrentTime", (time) => Vync.player.setCurrentTime(time).done());
Vync.socket.on("playback", (platform, videoId) => Vync.player.playback(platform, videoId).done());

Vync.socket.on("confirmName", (name) => updateOwnName(name));

Vync.socket.on("confirmName", (name) => updateOwnName(name));
Vync.socket.on("userupdate", (data) => updateUserlist(data));

/* Local player events */
Vync.player.on("timeupdate", (data) => {
    Vync.socket.emit("timeupdate", data);
});
Vync.player.on("playing", () => {
    Vync.socket.emit("playing");
});
Vync.player.on("paused", () => {
    Vync.socket.emit("paused");
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

function addPlaylistVideo(provider, media) {
    var item = {
        thumbnail: provider == "youtube" ? "https://img.youtube.com/vi/" + media + "/mqdefault.jpg" : provider == "vimeo" ? "/img/vimeo.png" : null,
        duration: media
    };
    $("#playlist-scroll").append(Vync.templates.playlistentry(item));
    $("#addurl button").stop().css("background-color", "green").animate({ backgroundColor: "none"}, 500);
}

/* Change name dialog */
$("#renameModal").on("show.bs.modal", function() {
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
    $("#self span").text(name);
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