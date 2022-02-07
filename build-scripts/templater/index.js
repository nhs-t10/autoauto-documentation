var fs = require("fs");

var TEMPLATE_BASE_DIR = __dirname + "/../../templates";

module.exports = Templater

var parser = require("./parser");

function Templater(templateSrc) {
    var self = this;

    this.template = parser.parse(templateSrc);

    return self;
}

/**
 * @type {Template}
 */
Templater.prototype.template = undefined;

Templater.prototype.render = function(ctxObj) {
    return _render(this.template, ctxObj);
}

var helpers = {
    each: function(args, template, ctxObj) {
        ctxObj = ctxObj[args[0]];
        if(ctxObj === undefined) return false;
        if(typeof ctxObj === "string") ctxObj = ctxObj.split(",");
        if(ctxObj.constructor != Array) {
            if(typeof ctxObj.length === "number") ctxObj = Array.from(ctxObj);
            else if(typeof ctxObj === "object") ctxObj = Object.values(ctxObj);
            else return "";
        }
        return ctxObj.map(x=>_render(template, x)).join("");
    },
    import: function(args, template, ctxObj) {
        var a = args[0] + ".handlebars";
        try {
            var t = new Templater(fs.readFileSync(TEMPLATE_BASE_DIR + "/" + a).toString());
            return t.render(ctxObj);
        } catch(e) {
            console.log(e);
            return _render(template, ctxObj);
        }
    }
}

/**
 * 
 * @param {Template} template
 * @param {object} ctxObj
 */
function _render(template, ctxObj) {
    return template.map(x=>{
        if(x.text) return x.text;

        if(x.prop == "this") return ctxObj;
        else if(x.prop) return ctxObj[x.prop];

        if(x.type) return helpers[x.type](x.args, x.content, ctxObj);
    }).join("");
}


/**
 * @typedef {TemplateMember[]} Template
 */

/**
 * @typedef {Object} TemplateMember
 * @property {string} [text]
 * @property {string} [type]
 * @property {string[]} [args]
 * @property {TemplateMember[]} [content]
 * @property {string} [prop]
 */