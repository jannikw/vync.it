/* global window:true document:true YT:true Q:true */

if (!window.Providers) {
    window.Providers = {};
}

window.Providers.youtube = function () {
    const SCRIPT_URL = "https://www.youtube.com/player_api";

    function YouTubeProvider() {
        this.name = "youtube";
        this.player = null;
        this.eventHandler = null;
        this.intervalId = null;
        this.destroyed = false;
    }

    YouTubeProvider.prototype.init = function (elementId, eventHandler) {
        this.eventHandler = eventHandler;

        let element = document.getElementById(elementId);
        let width = element.clientWidth;
        let height = element.lientheight;

        return Q.Promise((resolve) => {
            let tag = document.createElement("script");
            tag.src = SCRIPT_URL;

            let firstScripttag = document.getElementsByTagName("script")[0];
            firstScripttag.parentNode.insertBefore(tag, firstScripttag);

            window.onYouTubePlayerAPIReady = () => {            
                this.player = new YT.Player(elementId, {
                    height: height,
                    width: width,
                    events: {
                        onReady: () => {
                            resolve();
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
                                setTimeout(() => this.player.playVideo(), 500);
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
            };
        });
    };

    YouTubeProvider.prototype.destroy = function () {
        if (this.player) {
            this.player.destroy();
        }
        this.destroyed = true;
        clearInterval(this.intervalId);
    };

    YouTubeProvider.prototype.playback = function (media) {
        return Q.Promise((resolve) => {
            this.player.cueVideoById(media);
            resolve();
        });
    };

    YouTubeProvider.prototype.play = function () {
        return Q.Promise((resolve) => {
            this.player.playVideo();
            resolve();
        });
    };

    YouTubeProvider.prototype.pause = function () {
        this.player.pauseVideo();
        return Q();
    };

    YouTubeProvider.prototype.stop = function () {
        this.player.stopVideo();
        return Q();
    };

    YouTubeProvider.prototype.setCurrentTime = function (seconds) {
        this.player.seekTo(seconds);
        return Q();
    };

    YouTubeProvider.prototype.getCurrentTime = function () {
        return Q(this.player.getCurrentTime());
    };

    return YouTubeProvider;
}();