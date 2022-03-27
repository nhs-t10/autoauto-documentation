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
        var scrollPercent = Math.min(1, window.scrollY / (window.innerHeight / 3));
        
        var scrollOfHeight = scrollPercent * height;
        
        var angle = (scrollPercent * Math.PI / 2) + Math.PI;
        var epoint = [
            width - -width * 2 * Math.cos(angle),
            -height * 2 * Math.sin(angle)
        ];
        
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, scrollOfHeight * scrollPercent*scrollPercent);
        ctx.bezierCurveTo(
            width * 0.5, height * Math.sqrt(scrollPercent),
            width * 0.5, height * Math.sqrt(scrollPercent),
            width, scrollOfHeight * scrollPercent*scrollPercent
        );
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
    }
})