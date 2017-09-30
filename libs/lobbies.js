
function Lobby(id) {
    this.id = id;
    this.title = "Lobby " + id;
    this.members = [];
}

Lobby.prototype.join = function (user) {
    if (this.members[user.id]) {
        console.warn("user " + user.id + " is already in lobby " + this.id);
        return;
    }

    this.members[user.id] = user;
};

Lobby.prototype.isMember = function (user) {
    return this.members[user.id] != null;
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