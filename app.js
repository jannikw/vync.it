const express = require("express");
const hbs = require("express-hbs");
const session = require("express-session");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

let app = express();
let server = http.createServer(app);
let io = socketio.listen(server);

app.use(morgan("dev"));
app.set("view engine", "hbs");
app.engine("hbs", hbs.express4({
    defaultLayout: __dirname + "/views/layouts/default.hbs",
    partialsDir: __dirname + "/views/partials/",
    layoutsDir: __dirname + "/views/layouts/"
}));
app.set("views", __dirname + "/views/");

app.use(session({
    secret: "my secret secret"
}));

app.use(express.static(__dirname + "/public/"));
app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));

app.get("/", function (req, res) {
    res.locals.users = [
        { name: "Test1"},
        { name: "Test2"},
        { name: "Test3"},
    ];

    res.render("index");
});

io.on("connection", function (socket) {
    console.log("user connected");
});

server.listen(8080, () => {
    console.log("Server listening on port 8080...");
});