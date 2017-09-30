const Router = require("express").Router;

const router = new Router();

router.get("/", function (req, res) {
    res.send("show me teh lobbies!!");
});

router.get("/:id/", function (req, res) {
    res.send("show lobby " + req.params.id);
});

module.exports = router;
