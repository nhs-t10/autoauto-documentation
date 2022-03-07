document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("scroll-merge-in");

    canvas.width = window.innerWidth / 4;
    canvas.height = window.innerWidth;

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0D4D96";

    requestAnimationFrame(function anim() {

        reRenderCanvas(ctx, canvas.width, canvas.height);

        requestAnimationFrame(anim);
    });

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {*} width 
     */
    function reRenderCanvas(ctx, width, height) {
        var mid = width / 2;

        var scrollPercent = window.scrollY / (window.innerHeight / 2);
        var scrollOfHeight = scrollPercent * height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.bezierCurveTo(mid + scrollPercent*mid, scrollOfHeight, mid - scrollPercent*mid, scrollOfHeight, 0, scrollOfHeight);
        ctx.lineTo(0, height);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
    }
})