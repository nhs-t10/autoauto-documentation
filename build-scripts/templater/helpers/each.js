module.exports = function(args, template, ctxObj, assets, _render) {
    ctxObj = ctxObj[args[0]];
    if(ctxObj === undefined) return false;
    if(typeof ctxObj === "string") ctxObj = ctxObj.split(",");
    if(ctxObj.constructor != Array) {
        if(typeof ctxObj.length === "number") ctxObj = Array.from(ctxObj);
        else if(typeof ctxObj === "object") ctxObj = Object.values(ctxObj);
        else return "";
    }
    return ctxObj.map(x=>_render(template, x, assets)).join("");
}