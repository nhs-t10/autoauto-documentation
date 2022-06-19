const serverRenderBoardWidget = require("../assets/board-widget/server-render");

/**
 * @param {import("./fake-dom").FakeDocument} document
 */
module.exports = function(document, assets) {
    
    var main = document.getElementsByTagName("main")[0];
    
    main.getElementsByTagName("img").forEach(x=>{
        var title = x.getAttribute("title");
        if(title) {
            var fig = document.createElement("figure");
            var cap = document.createElement("figcaption");
            cap.textContent = title;
            x.parentNode.insertBefore(fig, x);
            fig.appendChild(x);
            fig.appendChild(cap);
        }
    });

    if(main.getElementsByClassName("md-codeblock")[0]) {
        var head = document.getElementsByTagName("head")[0];
        var style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", assets.get("/hlast-midnight.css"));
        head.appendChild(style);
    }

    serverRenderBoardWidget(document, assets);
    
    makeTableOfContents(document, main);
}

function makeTableOfContents(document, main) {
    /**
     * @type {import("./fake-dom").FakeDomNode[]}
     */
     var headings = main.getElementsByTagNames(["h2","h3","h4"]);
     var toca = document.getElementById("toc");
     var toc = document.createElement("nav");
     toca.setAttribute("class", "toc");
     toc.setAttribute("aria-label", "Table of Contents");
     
     var heading = document.createElement("h2");
     heading.textContent = "Table of Contents";
     toca.appendChild(heading);
     
    toca.appendChild(toc);
     
     var tocLevel = 1;
     var tocStack = [makeTocList(document, toc, tocLevel)];
     for(var i = 0; i < headings.length; i++) {
         var h = headings[i];
         var level = +h.nodeName.substring(1) - 1;
         var tocTop = tocStack[tocStack.length - 1];
         
         if(level > tocLevel) {
             tocTop = makeTocList(document, tocTop, level);
             tocStack.push(tocTop);
         } else if(level < tocLevel) {
             tocStack.pop();
             tocTop = tocStack[tocStack.length - 1];
         }
         tocLevel = level;
         tocTop.appendChild(makeTocLi(document, h));
     }
     return toca;
}

function makeTocLi(document, h) {
    var li = document.createElement("li");
    li.setAttribute("data-scroll-target-id", h.getAttribute("id"));
    
    var a = document.createElement("a");
    a.setAttribute("href", "#" + h.getAttribute("id"));
    a.textContent = h.textContent;
    
    li.appendChild(a);
    return li;
}

function makeTocList(document, p, lvl) {
    var e = document.createElement("ul");
    var toAppend = e;
    var lastChild = p.childNodes[p.childNodes.length - 1];
    if(lastChild && lvl > 1) {
        var expander = document.createElement("details");
        expander.appendChild(e);
        toAppend = expander;
        var summary = document.createElement("summary");
        summary.appendChild(lastChild.childNodes[0]);
        expander.appendChild(summary);
    } else {
        lastChild = p;
    }
    lastChild.appendChild(toAppend);
    return e;
}