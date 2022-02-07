var fs = require("fs");
var cp = require("child_process");

var lrb = Date.now();
var rbLock = false;
fs.watch(__dirname + "/../", {recursive: true}, function() {
    if(Date.now() - lrb > 50 && !rbLock) {
        console.log("Re-Building!");
        rebuild();
        lrb = Date.now();
    }
});

function rebuild() {
    rbLock = true;
    cp.exec("node build.js", {cwd: __dirname}, function(error, stdout, stderr) {
        rbLock = false;
        if(error) throw error;
        if(stdout) console.log(stdout);
        if(stderr) console.error(stderr);
    });
}
rebuild();