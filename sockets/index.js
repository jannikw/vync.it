
function init(io, state) {
    io.on("connection", (socket) => {
        let userId = socket.handshake.session.userId;
        let user = state.users.getUserById(userId);

        if (user == null) {
            console.warn("socket for unknown user, ignoring.")
            return;
        }
        
        console.log("socket connected for user: " + userId);

        user.setSocket(socket);
    });
}

module.exports = init;