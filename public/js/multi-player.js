
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
        return this.providers[this.currentProvider].play();
    }

    return null;
};

MultiPlayer.prototype.pause = function () {
    if (this.currentProvider) {
        return this.providers[this.currentProvider].pause();
    }

    return null;
};

MultiPlayer.prototype.stop = function () {
    if (this.currentProvider) {
        return this.providers[this.currentProvider].stop();
    }

    return null;
};

MultiPlayer.prototype.getCurrentTime = function () {
    if (this.currentProvider) {
        return this.providers[this.currentProvider].getCurrentTime();
    }

    return null;
};

MultiPlayer.prototype.setCurrentTime = function (seconds) {
    if (this.currentProvider) {
        return this.providers[this.currentProvider].setCurrentTime(seconds);
    }

    return null;
};

MultiPlayer.prototype.playback = function (providerName, media) {
    let newProvider = this.providers[providerName];
    let oldProvider = this.providers[this.currentProvider];

    if (!newProvider) {
        throw new Error("provider " +  providerName + " is unknown!");
    }

    // Check whether old an new provider are the same
    if (newProvider == oldProvider) {
        return newProvider.playback(media);
    }

    if (oldProvider) {
        oldProvider.destroy();
    }

    this.currentProvider = providerName;
    return newProvider.init(this.elementId, (event, data) => {
        console.log("MP event: " + event);

        let handlers = this.handlers[event];

        if (handlers != null && handlers.length > 0) {
            handlers.forEach((handler) => handler(data));
        }
    }).then(() => newProvider.playback(media));
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



