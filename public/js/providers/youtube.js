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
            this.player = new YT.Player(elementId, {
                height: height,
                width: width,
                events: {
                    onReady: () => {
                        this.ready = true;
                        this.playback(this.media);
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
                            break;
                        case YT.PlayerState.PAUSED:
                            this.eventHandler("paused");
                            break;
                        case YT.PlayerState.BUFFERING:
                            this.eventHandler("buffering");
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
        this.player.destroy();
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

    YouTubeProvider.prototype.getCurrentTime = function () {
        return this.player.getCurrentTime();
    };

    return new YouTubeProvider();
}();