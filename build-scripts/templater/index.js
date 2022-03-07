var fs = require("fs");

module.exports = Templater

var parser = require("./parser");

function Templater(templateSrc, assets) {
    var self = this;

    this.template = parser.parse(templateSrc);
    this.assets = assets;

    return self;
}

/**
 * @type {Template}
 */
Templater.prototype.template = undefined;

Templater.prototype.render = function(ctxObj) {
    return _render(this.template, ctxObj, this.assets);
}

var helpers = Object.fromEntries(
    fs.readdirSync(__dirname + "/helpers").map(x=>
        [
        x.replace(".js", ""), 
        require("./helpers/" + x)
    ])
);
/**
 * 
 * @param {Template} template
 * @param {object} ctxObj
 */
function _render(template, ctxObj, assets) {
    return template.map(x=>{
        if(x.text) return x.text;

        if(x.prop == "this") return ctxObj;
        else if(x.prop) return ctxObj[x.prop];

        if(x.type) {
            if(!helpers[x.type]) throw "No helper '" + x.type + "'";
            return helpers[x.type](x.args, x.content, ctxObj, assets, _render);
        }
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