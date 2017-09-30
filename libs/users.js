
function User(id, name) {
    this.id = id;
    this.name = name;
    this.temporary = true;
    this.socket = null;
}

User.prototype.setSocket = function (socket) {
    if (this.socket) {
        this.socket.disconnect();
    }

    this.socket = socket;
};

User.prototype.notify = function (event, data) {
    if (this.socket) {
        this.socket.emit(event, data);
    }
};

function UserManager() {
    this.users = [];
}

UserManager.prototype.createUser = function() {
    let id = this.users.length;
    let name = "User" + id;
    let user = new User(id, name);

    this.users.push(user);

    return user;
};

UserManager.prototype.getUserById = function (id) {
    return this.users[id];
};

UserManager.prototype.creator = function () {
    return (req, res, next) => {
        if (req.session.userId == null) {
            let user = this.createUser();
            req.session.userId = user.id;

            console.log("create new user: " + user.id);
        } else {
            console.log("request from existing user: " + req.session.userId);
        }

        next();
    };
};

module.exports = UserManager;