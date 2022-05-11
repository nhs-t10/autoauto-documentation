var addInterObserver = makeObserverClosure();
var selection = getListItemSelectionUtils();


window.addEventListener("load", function() {
    
    //only do this on a wide screen, where we can actually see the sidebar table-of-contents.
    if(window.innerWidth < 1000) return;
    
    var topLevelListItems = document.getElementById("toc").childNodes[1].childNodes[0].childNodes;
    
    for(var i = 0; i < topLevelListItems.length; i++) {
        var heading = document.getElementById(topLevelListItems[i].getAttribute("data-scroll-target-id"));
        addInterObserver(heading, topLevelListItems[i]);
    }
});
function makeObserverClosure() {
    var liElements = {};
    var observer = new IntersectionObserver(intersectCallback(liElements));
    
    return function addInterObserver(heading, liElement) {
        liElements[heading.id] = liElement;
        observer.observe(heading);
    }
}

function intersectCallback(liElements) {
    return function cb(entries) {
        for(var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.isIntersecting) {
                selection.selectItem(liElements[entry.target.id]);
                break;
            }
        }
    }
}

function getListItemSelectionUtils() {
    var selectedElement;
    
    function selectItemAfter(elem) {
        clearSel();
        
        selectedElement = elem.nextSibling;
        elem.nextSibling.classList.add("in-scroll-view");
    }
    function selectItemBefore(elem) {
        clearSel();

        selectedElement = elem.previousSibling;
        elem.previousSibling.classList.add("in-scroll-view");
    }
    function selectItem(elem) {
        clearSel();
        
        selectedElement = elem;
        elem.classList.add("in-scroll-view");
    }
    
    function clearSel() {
        if (selectedElement) selectedElement.classList.remove("in-scroll-view");
    }
    
    return {
        selectItemAfter: selectItemAfter,
        selectItemBefore: selectItemBefore,
        selectItem: selectItem
    }
}

