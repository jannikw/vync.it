
function init(io, state) {
    io.on("connection", (socket) => {
        let userId = socket.handshake.session.userId;
        let user = state.users.getUserById(userId);

        if (user == null) {
            console.warn("socket for unknown user, ignoring.");
            return;
        }

        console.log("socket " + socket.conn.id + " connected for user " + userId);

        socket.on("enter", (lobbyId) => {
            let lobby = state.lobbies.getLobbyById(lobbyId);

            if (lobby) {
                lobby.addSocket(socket);

                console.log("user " + userId + " entered lobby " + lobbyId + " with socket " + socket.conn.id);
            }
        });
    });
}

module.exports = init;