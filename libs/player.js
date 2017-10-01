const EventEmitter = require("events");

function Player() {
    this.playlist = [];
    this.currentMedia = null;
    this.events = new EventEmitter();
    this.disiredState = "stopped";
    this.actualState = "stopped";
    this.playState = null;
    this.blocking = {};
    this.ready = {};
}

Player.prototype.removeSession = function (id) {
    delete this.blocking[id];
    delete this.ready[id];
};

Player.prototype.addMedia = function (provider, media) {
    this.playlist.push({
        provider: provider,
        media: media
    });

    if (this.currentMedia == null) {
        this.currentMedia = this.playlist.shift();
        this.disiredState = "playing";
    }

    this.updateState();
};

Player.prototype.getCurrentMedia = function () {
    return this.currentMedia;
};

Player.prototype.block = function (id) {
    this.blocking[id] = true;
    console.log("blocking: " + id);
    this.updateState();
};

Player.prototype.unblock = function (id) {
    delete this.blocking[id];
    console.log("not blocking: " + id);
    this.updateState();
};

Player.prototype.isBlocked = function () {
    return Object.keys(this.blocking).length > 0;
};

Player.prototype.updateState = function () {
    if (this.actualState == "stopped" && this.disiredState == "playing") {
        console.log("state is stopped, but desired playing");
        this.actualState = "paused";
        this.events.emit("playback", this.currentMedia.provider, this.currentMedia.media);
    } 
    
    if (this.actualState == "playing" && this.isBlocked()) {
        console.log("playing but is blocked: pause");
        this.actualState = "paused";
        this.events.emit("pause");
    }

    if (this.actualState != "playing" && this.disiredState == "playing" && !this.isBlocked()) {
        console.log("playing is not blocked: play");
        this.actualState = "playing";
        this.events.emit("play");
    }
};

Player.prototype.play = function () {

};

Player.prototype.pause = function () {

};

module.exports = Player;