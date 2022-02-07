var lex = require("./parser").parse;

module.exports = function(src) {
    var s = extractFrontmatter(src);
    s.frontmatter.html = lex(s.src);
    return s.frontmatter;
}

function extractFrontmatter(src) {
    if(src.startsWith("---\n")) {
        var fmSrc = src.substring(4, src.indexOf("\n---\n"));
        //empty frontmatter? it's not frontmatter
        if(fmSrc.length == 0) return {src: src};

        var l = fmSrc.split("\n");
        var e = l.map(x=>x.split(":"))
            .map(x=>[x[0].trim(), x[1] = x.slice(1).join(":").trim()]);
        return {
            frontmatter: Object.fromEntries(e),
            src: src.substring(fmSrc.length + 8)
        };
    }
    return {src: src};
}
