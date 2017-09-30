/* global window:true document:true Vimeo:true Q:true */

if (!window.Providers) {
    window.Providers = {};
}

window.Providers.vimeo = function () {
    const SCRIPT_URL = "https://player.vimeo.com/api/player.js";

    function VimeoProvider() {
        this.name = "vimeo";
        this.player = null;
        this.eventHandler = null;
        this.elementId = null;
    }

    VimeoProvider.prototype.init = function(elementId, eventHandler) {
        return Q.Promise((resolve, reject) => {
            this.elementId = elementId;
            this.eventHandler = eventHandler;

            let element = document.getElementById(elementId);
            let width = element.clientWidth;
            let height = element.clientheight;
            
            let tag = document.createElement("script");
            tag.onload = () => {
                this.player = new Vimeo.Player(elementId, {
                    height: height,
                    width: width,
                    id: 59777392
                });
                this.player.on("timeupdate", (data) => this.eventHandler("timeupdate", data));
                this.player.on("play", () => this.eventHandler("play"));
                this.player.on("pause", () => this.eventHandler("pause"));
                this.player.on("buffering", () => this.eventHandler("buffering"));
                this.player.on("ended", () => this.eventHandler("ended"));
                this.player.on("error", (data) => this.eventHandler("error", data));
                this.player.on("loaded", () => this.eventHandler("ready"));
            };
            tag.src = SCRIPT_URL;

            let firstScripttag = document.getElementsByTagName("script")[0];
            firstScripttag.parentNode.insertBefore(tag, firstScripttag);
        });
    };

    VimeoProvider.prototype.destroy = function () {
        if (this.player) {
            this.player.off("timeupdate");
            this.player.off("play");
            this.player.off("pause");
            this.player.off("buffering");
            this.player.off("ended");
            this.player.off("error");
            this.player.off("loaded");
        }

        if (this.elementId) {
            var myNode = document.getElementById(this.elementId);
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
        }
    };

    VimeoProvider.prototype.playback = function (media) {
        return Q(this.player.loadVideo(media));
    };

    VimeoProvider.prototype.play = function () {
        return Q(this.player.play());
    };

    VimeoProvider.prototype.pause = function () {
        return Q(this.player.pause());
    };

    VimeoProvider.prototype.stop = function () {
        return Q(this.player.unload());
    };

    VimeoProvider.prototype.setCurrentTime = function (seconds) {
        return Q(this.player.getPaused()
            .then((paused) => {
                let promise = this.player.setCurrentTime(seconds);

                if (paused) {
                    return promise.then(() => this.player.pause());
                } else {
                    return promise;
                }
            }));
    };

    VimeoProvider.prototype.getCurrentTime = function () {
        return Q(this.player.getCurrentTime());
    };

    return VimeoProvider;
}();