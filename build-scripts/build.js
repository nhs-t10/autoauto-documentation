var fs = require("fs");
var path = require("path");

var public = __dirname + "/../public/";

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
        var relLink = "/" + path.posix.normalize(path.relative(__dirname + "/../md", x).replace(/.md$/, ""));
        var src = fs.readFileSync(x).toString();
        try {
            var m = mdParse(src);

            m.link = relLink
            
            return m;
        } catch(e) {
            console.error("MD syntax error in " + relLink);
            console.error(e);
        }
    }).filter(x=>x);


fs.writeFileSync(path.join(public, "index.html"), templates.index.render({ page: md }));

md.forEach(x => {
        x.breadcrumbs = [{ url: "/", title: "Home" }, {url: x.link, title: x.title }];

        x.html = templates.contentpage.render(x);
        var d = fakeDom.makeDocument(fakeDom.parseHTML(x.html));
        rewriteMdHtml(d);
        x.html = d.innerHTML;

        fs.writeFileSync(path.join(public, x.link + ".html"), x.html);
    }
);

function markdownFiles(folder) {
    return loadFilesWithExtension(folder, ".md");
}