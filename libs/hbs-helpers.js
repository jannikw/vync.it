const fs = require("fs");
const path = require("path");

function registerAll(hbs, settings) {
    hbs.registerHelper("embedPartial", (id, file) => {
        return "<script id=\"" + id + "\" type=\"text/x-handlebars-template\">" + 
            fs.readFileSync(path.join(settings.partialsDir, file)) +
            "</script>";
    });
}

module.exports.registerAll = registerAll;