
function toSeconds(t) {
    return t[0] + t[1] / 1000000000;
}

function Timer() {
    this.elapsed = 0;
    this.started = null;
}

Timer.prototype.elapsedTime = function (time) {
    if (time) {
        this.elapsed = time;
        this.started = process.hrtime();
    } else {
        if (this.started) {
            return this.elapsed + toSeconds(process.hrtime(this.started));
        } else {
            return this.elapsed;
        }
    }
};

Timer.prototype.start = function () {
    if (!this.started) {
        this.started = process.hrtime();
    }
};

Timer.prototype.stop = function () {
    if (this.started) {
        this.elapsed = this.elapsedTime();
    }
};

module.exports = Timer;