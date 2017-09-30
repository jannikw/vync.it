const Router = require("express").Router;

module.exports = function (state) {
    const router = new Router();

    router.use("/lobbies/", require("./lobbies.js")(state));
    router.use("/test/", require("./test.js"));

    return router;
};