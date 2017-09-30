const Router = require("express").Router;

module.exports = function (state) {
    const router = new Router();

    router.get("/", function (req, res) {
        res.render("index");
    });

    router.use("/lobbies/", require("./lobbies.js")(state));
    router.use("/test/", require("./test.js"));

    return router;
};