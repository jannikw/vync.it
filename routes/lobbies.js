const Router = require("express").Router;

module.exports = function (state) {
    const router = new Router();

    router.get("/", function (req, res) {
        res.send("show me teh lobbies!!");
    });

    router.get("/create", function (req, res) {
        let lobby = state.lobbies.createLobby();

        res.redirect(lobby.id);
    });

    router.get("/:id/", function (req, res) {
        let lobby = state.lobbies.getLobbyById(req.params.id);
        let user = state.users.getUserById(req.session.userId);

        if (lobby) {
            if (!lobby.isMember(user)) {
                lobby.join(user);
            }

            res.locals.user = user;
            res.locals.lobby = lobby;

            res.render("lobby");
        } else {
            res.send("lobby not found");
        }
    });

    return router;
};
