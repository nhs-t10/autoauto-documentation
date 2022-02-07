/**
 * @param {import("./fake-dom").FakeDocument} document
 */
module.exports = function(document) {
    
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
        style.setAttribute("href", "/assets/hlast-midnight.css")
        head.appendChild(style);
    }
    
    
    main.parentElement.insertBefore(makeTableOfContents(document, main), main.childNodes[0]);
}

function makeTableOfContents(document, main) {
    /**
     * @type {import("./fake-dom").FakeDomNode[]}
     */
     var headings = main.getElementsByTagNames(["h2","h3","h4"]);
     var toca = document.createElement("aside");
     var toc = document.createElement("nav");
     toca.setAttribute("class", "toc");
     toc.setAttribute("aria-label", "Table of Contents");
     toca.appendChild(toc);
     
     var tocStack = [makeTocList(document, toc)];
     var tocLevel = 1;
     for(var i = 0; i < headings.length; i++) {
         var h = headings[i];
         var level = +h.nodeName.substring(1) - 1;
         var tocTop = tocStack[tocStack.length - 1];
         
         if(level > tocLevel) {
             tocTop = makeTocList(document, tocTop);
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
    
    var a = document.createElement("a");
    a.setAttribute("href", "#" + h.getAttribute("id"));
    a.textContent = h.textContent;
    
    li.appendChild(a);
    return li;
}

function makeTocList(document, p) {
    var e = document.createElement("ul");
    p.appendChild(e);
    return e;
}