const Player = require("./player");

function Lobby(id) {
    this.id = id;
    this.title = "Lobby " + id;
    this.members = [];
    this.sockets = [];
    this.player = new Player();

    this.updateNamesHandler = () => this.notifyUserUpdate();
    
    this.player.events.on("playback", (provider, media) => {
        this.sockets.forEach((socket) => this.player.block(socket.conn.id));
        this.notifyAll("playback", provider, media);
    });
    this.player.events.on("play", () => this.notifyAll("play"));
    this.player.events.on("pause", () => this.notifyAll("pause"));
    this.player.events.on("stop", () => this.notifyAll("stop"));
    this.player.events.on("adjustTime", (time) => this.notifyAll("setCurrentTime", time));
}

Lobby.prototype.addSocket = function (socket) {
    this.sockets.push(socket);

    let userId = socket.handshake.session.userId;
    let user = this.members.find((user) => user.id == userId);
    let socketId = socket.conn.id;

    socket.on("disconnect", () => {
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);

        var userConnected = this.sockets.some((socket) => socket.handshake.session.userId == userId); 

        if (!userConnected) {
            this.leave(user);
        }

        this.player.unblock();
    });

    socket.on("timeupdate", (data) => this.player.checkClientTime(data.seconds));
    socket.on("ready", () => this.player.unblock(socketId));
    socket.on("buffering", () => this.player.block(socketId));
    socket.on("playing", () =>  {
        this.player.unblock(socketId);
        this.player.play();
    });
    socket.on("paused", () => {
        this.player.pause();
    });
    socket.on("playing", () => {
        this.player.play();
    });

    socket.on("changeName", (name) => {
        user.updateName(name);
        socket.emit("confirmName", name);
    });

    socket.on("addMedia", (input) => {
        this.player.addMedia("youtube", input);
    });

    let current = this.player.getCurrentMedia();

    if (current) {
        socket.emit("playback", current.provider, current.media);
        this.player.block(socketId);
    }
};

Lobby.prototype.join = function (user) {
    let index = this.members.indexOf(user);

    if (index != -1) {
        console.warn("user " + user.id + " is already in lobby " + this.id);
        return;
    }

    this.members.push(user);
    this.notifyUserUpdate();

    user.events.on("updateName", this.updateNamesHandler);
};

Lobby.prototype.leave = function (user) {
    let index = this.members.indexOf(user);
    
    if (index == -1) {
        return;
    }

    user.events.removeListener("updateName", this.updateNamesHandler);

    this.members.splice(index, 1);
    this.notifyUserUpdate();
};

Lobby.prototype.notifyUserUpdate = function () {
    this.notifyAll("userupdate", 
        this.members.map((member) => {
            return {
                id: member.id,
                name: member.name
            };
        }));
};

Lobby.prototype.notifyAll = function () {
    this.sockets.forEach((socket) => socket.emit.apply(socket, arguments));
};

Lobby.prototype.isMember = function (user) {
    return this.members.indexOf(user.id) != -1;
};

function LobbyManager() {
    this.lobbies = {};
    this.count = 0;
}

LobbyManager.prototype.getAllLobbies = function () {
    return this.lobbies;
};

LobbyManager.prototype.createLobby = function () {
    this.count++;

    let id = "lobby" + this.count;
    let lobby = new Lobby(id);

    this.lobbies[id] = lobby;

    return lobby;
};

LobbyManager.prototype.getLobbyById = function (id) {
    return this.lobbies[id];
};

module.exports = LobbyManager;