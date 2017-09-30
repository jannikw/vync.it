const Router = require("express").Router;

const router = new Router();

router.use("/lobbies/", require("./lobbies.js"));
router.use("/test/", require("./test.js"));

module.exports = router;
