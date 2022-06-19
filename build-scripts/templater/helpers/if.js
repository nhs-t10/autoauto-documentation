module.exports = function(args, template, ctxObj, assets, _render) {
    if(ctxObj[args[0]]) {
        return _render(template, ctxObj, assets);
    } else {
        return "";
    }
}