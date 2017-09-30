const Router = require("express").Router;

const router = new Router();

router.get("/lobbies/", require("./lobbies.js"));
router.use("/test/", require("./test.js"));

module.exports = router;
