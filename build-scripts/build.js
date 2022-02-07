var fs = require("fs");
var path = require("path");

var public = __dirname + "/../public/";

if(!fs.existsSync(public)) fs.mkdirSync(public);
if(!fs.existsSync(public + "/pages")) fs.mkdirSync(public + "/pages");

var Templater = require("./templater");
var mdParse = require("./md-parser");
var fakeDom = require("./fake-dom");
var rewriteMdHtml = require("./rewrite-md-html");

var templates = Object.fromEntries(
    fs.readdirSync(__dirname + "/../templates")
        .map(x => [x.split(".")[0], new Templater(fs.readFileSync(__dirname + "/../templates/" + x).toString())])
);

var md = markdownFiles(__dirname + "/../md")
    .map(x => {
        var relLink = "/" + path.posix.normalize(path.relative(__dirname + "/../md", x).replace(/.md$/, ""));
        var src = fs.readFileSync(x).toString();
        try {
            var m = mdParse(src);

            m.link = relLink
            
            return m;
        } catch(e) {
            console.error("MD syntax error in " + relLink);
        }
    }).filter(x=>x);


fs.writeFileSync(path.join(public, "pages/index.html"), templates.index.render({ page: md }));

md.forEach(x => {
        x.breadcrumbs = [{ url: "/", title: "Home" }, {url: x.link, title: x.title }];

        x.html = templates.contentpage.render(x);
        var d = fakeDom.makeDocument(fakeDom.parseHTML(x.html));
        rewriteMdHtml(d);
        x.html = d.innerHTML;

        fs.writeFileSync(path.join(public, "pages", x.link + ".html"), x.html);
    }
);

function markdownFiles(dir) {
    var files = fs.readdirSync(dir, { withFileTypes: true });
    var md = [];

    for (var i = 0; i < files.length; i++) {
        var f = files[i];

        var fName = path.join(dir, f.name);

        if (f.isDirectory()) md = md.concat(markdownFiles(fName));
        else if (f.name.endsWith(".md")) md.push(fName);
    }
    return md;
}