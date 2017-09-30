
function init(io) {
    io.on("connection", (socket) => {
        console.log("socket session: " + JSON.stringify(socket.handshake));
        console.log("socket session id: " + socket.handshake.sessionID);
        console.log("session: " + socket.handshake.message);
    });
}

module.exports = init;