const express = require("express");
const hbs = require("express-hbs");
const session = require("express-session");

let app = express();

app.set("view engine", "hbs");
app.engine("hbs", hbs.express4({
    defaultLayout: __dirname + "/views/layouts/default.hbs",
    partialsDir: __dirname + "/views/partials/",
    layoutsDir: __dirname + "/views/layouts/"
}));
app.set("views", __dirname, "/views/");

app.use(session({
    secret: "my secret secret"
}));

app.get("/", function (req, res) {
    res.send("Hello there!");
});

app.listen(8080, () => {
    console.log("Server listening on port 8080...");
});