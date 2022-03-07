var path = require("path");
var fs = require("fs");

module.exports = function loadFiles(dir, ext) {
    if(!ext) ext = "";
    ext = ext + "";
    
    var files = fs.readdirSync(dir, { withFileTypes: true });
    var md = [];

    for (var i = 0; i < files.length; i++) {
        var f = files[i];

        var fName = path.join(dir, f.name);

        if (f.isDirectory()) md = md.concat(loadFiles(fName, ext));
        else if (f.name.endsWith(ext)) md.push(fName);
    }
    return md;
}