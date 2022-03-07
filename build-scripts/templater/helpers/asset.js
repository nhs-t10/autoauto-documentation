module.exports = function(args, template, ctxObj, assets, _render) {
    var joinedAssetName = args.join(" ");
    
    var assetID = assets.get(joinedAssetName);
    
    return assetID;
}