const express = require("express");
const hbs = require("express-hbs");
const session = require("express-session");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const path = require("path");
const socketio = require("socket.io");
const socketSession = require("express-socket.io-session");
const http = require("http");

const routes = require("./routes/");
const sockets = require("./sockets/");

let app = express();
let server = http.createServer(app);
let io = socketio.listen(server);

let sessionManager =session({
    secret: "my secret secret",
    resave: true,
    saveUninitialized: true
});

let socketSessionManager = socketSession(sessionManager, {
    autosave: true
});

app.use(sessionManager);
io.use(socketSessionManager);

sockets(io);

app.use(morgan("dev"));
app.set("view engine", "hbs");
app.engine("hbs", hbs.express4({
    defaultLayout: __dirname + "/views/layouts/default.hbs",
    partialsDir: __dirname + "/views/partials/",
    layoutsDir: __dirname + "/views/layouts/"
}));
app.set("views", __dirname + "/views/");

app.use(express.static(__dirname + "/public/"));
app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));

app.use(routes);

io.on("connection", function (socket) {
    console.log("user connected: " + socket);
});

server.listen(8080, () => {
    console.log("Server listening on port 8080...");
});