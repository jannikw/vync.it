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

// Business logic
const LobbyManager = require("./libs/lobbies.js");
const UserManager = require("./libs/users");

let state = {
    lobbies: new LobbyManager(),
    users: new UserManager()
};

// Setup servers
let app = express();
let server = http.createServer(app);
let io = socketio.listen(server);

// Setup session managment
let sessionManager = session({
    secret: "my secret secret",
    resave: true,
    saveUninitialized: true
});
let socketSessionManager = socketSession(sessionManager, {
    autosave: true
});
app.use(sessionManager);
io.use(socketSessionManager);

// Setup express
app.use(morgan("dev"));
app.set("view engine", "hbs");
app.engine("hbs", hbs.express4({
    defaultLayout: __dirname + "/views/layouts/default.hbs",
    partialsDir: __dirname + "/views/partials/",
    layoutsDir: __dirname + "/views/layouts/"
}));
app.set("views", __dirname + "/views/");

// Setup static file serving and favicon
app.use(express.static(__dirname + "/public/"));
app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));

// Wire up business logic with express and socket.io
app.use(state.users.creator());
app.use(routes(state));
sockets(io, state);

io.on("connection", function (socket) {
    console.log("user connected: " + socket);
});

// Start the server
server.listen(8080, () => {
    console.log("Server listening on port 8080...");
});