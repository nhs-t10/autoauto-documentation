var TEMPLATE_BASE_DIR = __dirname + "/../../../templates";

var Templater = require("..");
var fs = require("fs");

module.exports = function(args, template, ctxObj, assets, _render) {
    var a = args[0] + ".handlebars";
    try {
        var t = new Templater(fs.readFileSync(TEMPLATE_BASE_DIR + "/" + a).toString());
        return t.render(ctxObj);
    } catch(e) {
        console.log(e);
        return _render(template, ctxObj, assets);
    }
}