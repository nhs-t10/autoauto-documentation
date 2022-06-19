var fs = require("fs");
var path = require("path");

var public = __dirname + "/../public/";

cleanDir(public);
if(!fs.existsSync(public)) fs.mkdirSync(public);

var Templater = require("./templater");
var mdParse = require("./md-parser");
var fakeDom = require("./fake-dom");
var rewriteMdHtml = require("./rewrite-md-html");
var loadFilesWithExtension = require("./load-files-with-extension");
var assets = require("./asset-manager");

var templates = Object.fromEntries(
    fs.readdirSync(__dirname + "/../templates")
        .map(x => [x.split(".")[0], new Templater(fs.readFileSync(__dirname + "/../templates/" + x).toString(), assets)])
);

var md = markdownFiles(__dirname + "/../md")
    .map(x => {
        var relLink = "/" + path.relative(__dirname + "/../md", x).replace(/\\/g, "/").replace(/\.md$/, "");
        var src = fs.readFileSync(x).toString();
        try {
            var m = mdParse(src);

            m.link = relLink.replace(/(index)?$/, "");
            m.fileLink = relLink;
            
            return m;
        } catch(e) {
            console.error("MD syntax error in " + relLink);
            console.error(e);
        }
    }).filter(x=>x);


fs.writeFileSync(path.join(public, "index.html"), templates.index.render({ page: md }));

md.forEach(x => {
        var linkSegments = x.link.split("/");
        x.breadcrumbs = linkSegments.map((linkSegment,i)=> ({
            url: linkSegments.slice(0, i + 1).join("/") || "/",
            title: linkSegment || (i == 0 ? "Home" : "")
        }));

        x.html = templates.contentpage.render(x);
        var d = fakeDom.makeDocument(fakeDom.parseHTML(x.html));
        rewriteMdHtml(d, assets);
        x.html = d.innerHTML;

        safeWrite(path.join(public, x.fileLink + ".html"), x.html);
    }
);

function safeWrite(file, contents) {
    var folder = path.dirname(file);
    if(!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {recursive: true});
    }
    fs.writeFileSync(file, contents);
}

function markdownFiles(folder) {
    return loadFilesWithExtension(folder, ".md");
}

function cleanDir(folder) {
    if(!fs.existsSync(folder)) return true;

    var contents;
    try {
        contents = fs.readdirSync(folder);
    } catch(e) {
        fs.unlinkSync(folder);
        return true;
    }

    var contCount = contents.length;

    for(const filename of contents) {
        if(cleanDir(path.join(folder, filename))) contCount--;
    }

    if(contCount == 0) fs.rmdirSync(folder);

    return contCount == 0;
}