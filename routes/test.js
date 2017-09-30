const Router = require("express").Router;

const router = new Router();

router.get("/", function (req, res) {
    res.locals.users = [
        { name: "User 1"},
        { name: "User 2"},
        { name: "User 3"},
    ];
    res.locals.upcoming = [
        { id: "tdUX3ypDVwI", title: "Making Life Multiplanetary"},
        { id: "bvim4rsNHkQ", title: "How Not to Land an Orbital Rocket Booster"},
        { id: "zqE-ultsWt0", title: "BFR | Earth to Earth"},
        { id: "tdUX3ypDVwI", title: "Making Life Multiplanetary"},
        { id: "bvim4rsNHkQ", title: "How Not to Land an Orbital Rocket Booster"},
        { id: "zqE-ultsWt0", title: "BFR | Earth to Earth"},
        { id: "tdUX3ypDVwI", title: "Making Life Multiplanetary"},
        { id: "bvim4rsNHkQ", title: "How Not to Land an Orbital Rocket Booster"},
        { id: "zqE-ultsWt0", title: "BFR | Earth to Earth"},
    ];

    res.render("index");
});

module.exports = router;
