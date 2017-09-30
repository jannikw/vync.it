
function MultiPlayer(elementId) {
    this.elementId = elementId;
    this.handlers = {
        timeupdate: [],
        play: [],
        pause: [],
        buffering: [],
        ended: [],
        error: [],
        ready: [],
    };
    this.providers = {};
    this.currentProvider = null;
}

MultiPlayer.prototype.play = function () {
    if (this.currentProvider) {
        return this.currentProvider.play();
    }

    return null;
};

MultiPlayer.prototype.pause = function () {
    if (this.currentProvider) {
        return this.currentProvider.pause();
    }

    return null;
};

MultiPlayer.prototype.stop = function () {
    if (this.currentProvider) {
        return this.currentProvider.stop();
    }

    return null;
};

MultiPlayer.prototype.getCurrentTime = function () {
    if (this.currentProvider) {
        return this.currentProvider.getCurrentTime();
    }

    return null;
};

MultiPlayer.prototype.setCurrentTime = function (seconds) {
    if (this.currentProvider) {
        return this.currentProvider.setCurrentTime(seconds);
    }

    return null;
};

MultiPlayer.prototype.playback = function (providerName, media) {
    // Check whether old an new provider are the same
    if (this.currentProvider && this.currentProvider.name == providerName) {
        return this.currentProvider.playback(media);
    }

    let providerConstructor = this.providers[providerName];

    if (!providerConstructor) {
        throw new Error("provider " + providerName + " is unknown");
    }

    if (this.currentProvider) {
        this.currentProvider.destroy();
    }

    this.currentProvider = new providerConstructor();
    return this.currentProvider
        .init(this.elementId, (event, data) => {
            console.log("MP event: " + event);

            let handlers = this.handlers[event];

            if (handlers != null && handlers.length > 0) {
                handlers.forEach((handler) => handler(data));
            }
        })
        .then(() => this.currentProvider.playback(media));
};

MultiPlayer.prototype.on = function (event, handler) {
    let handlers = this.handlers[event];

    if (handlers && !handlers.includes(handler)) {
        this.handlers[event].push(handler);
    }
};

MultiPlayer.prototype.off = function (event, handler) {
    let handlers = this.handlers[event];

    if (handlers) {
        if (handler) {
            let index = handlers.indexOf(handler);
            handlers.splice(index, 1);
        } else {
            this.handlers[event] = [];
        }
    }
};

MultiPlayer.prototype.addProvider = function (name, provider) {
    if (this.providers[name]) {
        console.warn("provider " + name + " does already exist!");
    } else {
        this.providers[name] = provider;
    }
};

MultiPlayer.prototype.destroy = function () {
    if (this.currentProvider) {
        this.providers[this.currentProvider].destroy();
    }
};



