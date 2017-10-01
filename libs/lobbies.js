
function Lobby(id) {
    this.id = id;
    this.title = "Lobby " + id;
    this.members = [];
    this.sockets = [];
    this.playlist = [];
}

Lobby.prototype.addSocket = function (socket) {
    this.sockets.push(socket);

    socket.on("disconnect", () => {
        let userId = socket.handshake.session.userId;
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);

        var userConnected = this.sockets.some((socket) => socket.handshake.session.userId == userId); 

        if (!userConnected) {
            let user = this.members.find((user) => user.id == userId);
            this.leave(user);
        }
    });
};

Lobby.prototype.join = function (user) {
    let index = this.members.indexOf(user);

    if (index != -1) {
        console.warn("user " + user.id + " is already in lobby " + this.id);
        return;
    }

    this.members.push(user);
    this.notifyUserUpdate();

    user.events.once("disconnect", () => this.leave(user));
};

Lobby.prototype.leave = function (user) {
    let index = this.members.indexOf(user);
    
    if (index == -1) {
        return;
    }

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

Lobby.prototype.notifyAll = function (event, data) {
    this.sockets.forEach((socket) => socket.emit(event, data));
};

Lobby.prototype.isMember = function (user) {
    return this.members.indexOf(user.id) != -1;
};

function LobbyManager() {
    this.lobbies = {};
    this.count = 0;
}

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