/* global window:true document:true YT:true */

if (!window.Providers) {
    window.Providers = {};
}

window.Providers.youtube = function () {
    const SCRIPT_URL = "https://www.youtube.com/player_api";

    function YouTubeProvider() {
        this.player = null;
        this.eventHandler = null;
        this.media = null;
        this.ready = false;
        this.intervalId = null;
        this.destroyed = false;
    }

    YouTubeProvider.prototype.init = function (elementId, eventHandler) {
        this.eventHandler = eventHandler;

        let element = document.getElementById(elementId);
        let width = element.clientWidth;
        let height = element.clientheight;
        
        let tag = document.createElement("script");
        tag.src = SCRIPT_URL;

        let firstScripttag = document.getElementsByTagName("script")[0];
        firstScripttag.parentNode.insertBefore(tag, firstScripttag);

        window.onYouTubePlayerAPIReady = () => {
            if (this.destroyed) {
                return;
            }

            this.player = new YT.Player(elementId, {
                height: height,
                width: width,
                events: {
                    onReady: () => {
                        if (this.destroyed) {
                            this.destroy();
                        } else {
                            this.ready = true;
                            this.playback(this.media);
                        }
                    },
                    onStateChange: (state) => {
                        switch (state.data) {
                        case YT.PlayerState.UNSTARTED:
                            //this.eventHandler("ready");
                            break;
                        case YT.PlayerState.ENDED:
                            this.eventHandler("ended");
                            break;
                        case YT.PlayerState.PLAYING:
                            this.eventHandler("playing");
                            this.intervalId = setInterval(() => {
                                this.eventHandler("timeupdate", {
                                    seconds: this.player.getCurrentTime(),
                                    duration: this.player.getDuration()
                                });
                            }, 100);
                            break;
                        case YT.PlayerState.PAUSED:
                            this.eventHandler("paused");
                            clearInterval(this.intervalId);
                            break;
                        case YT.PlayerState.BUFFERING:
                            this.eventHandler("buffering");
                            clearInterval(this.intervalId);
                            break;
                        case YT.PlayerState.CUED:
                            this.eventHandler("ready", {
                                provider: "youtube",
                                media: this.media
                            });
                            break;
                        }
                    }
                }
            });
            this.playback(this.media);
        };
    };

    YouTubeProvider.prototype.destroy = function () {
        if (this.player) {
            this.player.destroy();
        }
        this.destroyed = true;
        clearInterval(this.intervalId);
    };

    YouTubeProvider.prototype.playback = function (media) {
        this.media = media;
        if (this.player != null && this.ready) {
            this.player.cueVideoById(this.media);
        }
    };

    YouTubeProvider.prototype.play = function () {
        this.player.playVideo();
    };

    YouTubeProvider.prototype.pause = function () {
        this.player.pauseVideo();
    };

    YouTubeProvider.prototype.stop = function () {
        this.player.stopVideo();
    };

    YouTubeProvider.prototype.setCurrentTime = function (seconds) {
        this.player.seekTo(seconds);
    };

    YouTubeProvider.prototype.getCurrentTime = function (callback) {
        callback(this.player.getCurrentTime());
    };

    return new YouTubeProvider();
}();