$(document).ready(function(){
    var canvas = new fabric.Canvas("canvas-layout", {
        width: 1000,
        height: 600,
        selection: false,
        fill: "green",
        evented: true
    });

    canvas.setBackgroundColor("darkblue");
    fabric.Object.prototype.transparentCorners = false;
    canvas.preserveObjectStacking = true;
    let leftPage = new CanvasLayout(canvas, 2, 2, "left");
    let rightPage = new CanvasLayout(canvas, 4, 2, "right");
    //leftPage.mergeRow(1, 2);
    leftPage.setPadding(34)
    leftPage.setBackgroundColor("green");
    leftPage.setBorder(2, "blue");
    rightPage.mergeCol(1, 2, 3);
    rightPage.setBackgroundColor("transparent");
    rightPage.setBorder(2, "yellow");
    rightPage.setPadding(12);
    rightPage.setMarginTop(23);
    //rightPage.setCol(6);
    //rightPage.lock();
    //leftPage.lock();
    //rightPage.clip();
})