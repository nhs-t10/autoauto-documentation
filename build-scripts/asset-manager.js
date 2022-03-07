var fs = require("fs");
var path = require("path");
var loadFilesWithExtension = require("./load-files-with-extension");
var crypto = require("crypto");

var assetFolder = path.join(__dirname, "../assets");

var publicFolder = path.join(__dirname, "../public/assets");
if(!fs.existsSync(publicFolder)) fs.mkdirSync(publicFolder);

var assetFiles = loadFilesWithExtension(assetFolder, "");
var assetsKeyed = {};

assetFiles.forEach(x=>fillAssetObject(x, assetsKeyed));

module.exports = {
    get: function(assetfile) {
        var k = assetsKeyed[assetfile];
        if(k) return k;
        else return assetsKeyed["/" + assetfile];
    }
}

function fillAssetObject(assetFileName, assetsKeyed) {
    var content = fs.readFileSync(assetFileName);
    var ext = path.extname(assetFileName);
    
    var keyBuffer = Buffer.concat([
        Buffer.from(content.length + " " + assetFileName + "\0"),
        content
    ]);
    var key = crypto.createHash("sha1").update(keyBuffer).digest("hex");
    
    var webFile = key + ext;
    if(path.basename(assetFileName).startsWith("_")) webFile = "../" + path.basename(assetFileName);
    
    fs.writeFileSync(path.join(publicFolder, webFile), content);
    
    var relFile = assetFileName.replace(assetFolder, "")
        .replace(/\\/g, "/");
    assetsKeyed[relFile] = "/assets/" + webFile;
}