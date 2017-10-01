const EventEmitter = require("events");
const Timer = require("./timer.js");

const MAX_ALLOWED_TIME_DIFF = 2;

function Player() {
    this.playlist = [];
    this.currentMedia = null;
    this.events = new EventEmitter();
    this.disiredState = "stopped";
    this.actualState = "stopped";
    this.blocking = {};
    this.ready = {};
    this.timer = new Timer();
}

Player.prototype.removeSession = function (id) {
    delete this.blocking[id];
    delete this.ready[id];
};

Player.prototype.addMedia = function (provider, media) {
    console.log("added playist item: provider=" + provider + ", media=" + media);

    this.playlist.push({
        provider: provider,
        media: media
    });
    this.events.emit("playlistAdd", provider, media);

    if (this.currentMedia == null) {
        this.next();
    }
};

Player.prototype.getCurrentMedia = function () {
    return this.currentMedia;
};

Player.prototype.next = function () {
    this.disiredState = "stopped";
    this.currentMedia = null;
    this.timer.stop();
    this.timer.elapsedTime(0);
    this.updateState();

    if (this.playlist.length > 0) {
        this.currentMedia = this.playlist.shift();
        this.disiredState = "playing";
        this.updateState();
        this.events.emit("playlistRemove", this.currentMedia.provider, this.currentMedia.media);
    }
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
    console.log("updating state for actual=" + this.actualState + " desired=" + this.disiredState + 
        " with blocking: " + Object.keys(this.blocking).length);

    if (this.disiredState == "stopped") {
        this.actualState = "stopped";
        this.events.emit("stop");
        this.timer.stop();
        this.timer.elapsedTime(0);
    }

    if (this.actualState == "adjusting") {
        //this.actualState = "paused";
        this.timer.stop();
        //this.events.emit("pause");
        this.events.emit("adjustTime", this.timer.elapsedTime());
    }

    if (this.actualState == "stopped" && this.disiredState == "playing") {
        console.log("state is stopped, but desired playing");
        this.actualState = "paused";
        this.timer.stop();
        this.timer.elapsedTime(0);
        this.events.emit("playback", this.currentMedia.provider, this.currentMedia.media);
    } 
    
    if (this.actualState == "playing" && this.isBlocked()) {
        console.log("playing but is blocked: pause");
        this.actualState = "paused";
        this.timer.stop();
        this.events.emit("pause");
    }

    if (this.actualState != "playing" && this.disiredState == "playing" && !this.isBlocked()) {
        console.log("playing is not blocked: play");
        this.actualState = "playing";
        this.events.emit("play");
        this.timer.start();
    }

    if (this.actualState != "paused" && this.disiredState == "paused") {
        console.log("pausing desired, pausing");
        this.actualState = "paused";
        this.timer.stop();
        this.events.emit("pause");
    }
};

Player.prototype.play = function () {
    this.disiredState = "playing";
    console.log("playing desired");
    this.updateState();
};

Player.prototype.pause = function () {
    this.disiredState = "paused";
    this.timer.stop();
    this.updateState();
};

Player.prototype.adjustTime = function (time) {
    this.timer.stop();
    this.timer.elapsedTime(time);
    console.log("adjusting time to " + time);
    this.actualState = "adjusting";
    this.updateState();
};

Player.prototype.checkClientTime = function (clientTime) {
    let serverTime = this.timer.elapsedTime();
    let timeDiff = Math.abs(serverTime - clientTime);

    if (timeDiff > MAX_ALLOWED_TIME_DIFF) {
        console.log("Adjustment needed! Time diff: " + timeDiff);
        this.adjustTime(serverTime);
    }
};

module.exports = Player;