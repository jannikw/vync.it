const Router = require("express").Router;

module.exports = function (state) {
    const router = new Router();

    router.get("/", function (req, res) {
        res.send("show me teh lobbies!!");
    });

    router.get("/create", function (req, res) {
        let lobby = state.lobbies.createLobby();

        req.session.lobby = lobby.id;

        res.redirect(lobby.id);
    });

    router.get("/:id/", function (req, res) {
        let lobby = state.lobbies.getLobbyById(req.params.id);

        if (lobby) {
            res.send("lobby found: " + lobby.title);
        } else {
            res.send("lobby not found");
        }
    });

    return router;
};
