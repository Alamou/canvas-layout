/**
 * Create a simple layout as a column line. 
 * @class CanvasLayout
 * @since 1.0.0
 * @link #
 * @author Nahim SALAMI
 */

 var CanvasLayout = (function () {
    /**
     * Create a layout as a column line
     * @param {*object} canvas A canvas object
     * @param {*int} row 
     * @param {*int} col 
     * @param {*string} page 
     */
    function CanvasLayout(canvas, row = 1, col = 1, page = "both") {
        this.canvas = canvas;
        this.countCell = row * col;
        this.row = row;
        this.col = col;
        this.cell = [];
        this.padding = 0;
        this.color = "transparent";
        this.height = this.canvas.get("height");
        if (page == "both") {
            this.width = this.canvas.get("width");
        }
        else if (page == "left" || page == "right") {
            this.width = this.canvas.get("width") / 2;
        }
        this.page = page;
        this.cellHeight = this.height / row;
        this.cellWidth = this.width / col;
        this.initLayout();
    }

    CanvasLayout.prototype.initLayout = function () {
        var cellProperty = {
            height: this.cellHeight - this.padding,
            width: this.cellWidth - this.padding,
            fill: this.color,
            stroke: "blue",
            strokeWidth: 2
        }

        for (let ligne = 0; ligne < this.row; ligne++) {

            if (typeof this.cell[ligne] === "undefined") {
                this.cell[ligne] = [];
            }

            for (let cell = 0; cell < this.col; cell++) {
                //Top = height * ligne;
                //Left = width * cell;
                if (this.page == "right") {
                    cellProperty.left = (this.padding / 2) + this.width + cellProperty.width * cell + ((this.padding / 2) * cell + 1);
                }
                else {
                    cellProperty.left = (this.padding / 2) + cellProperty.width * cell + ((this.padding / 2) * cell + 1);
                }

                cellProperty.top = this.padding + cellProperty.height * ligne + ((this.padding / 2) * ligne + 1);
                cellProperty.col = cell + 1;
                cellProperty.row = ligne + 1;
                this.cell[ligne][cell] = new fabric.Rect(cellProperty);
                this.canvas.add(this.cell[ligne][cell]);
            }
        }

    }

    CanvasLayout.prototype.set = function (value) {
        this.cell.forEach(arr => {
            arr.forEach(obj => {
                obj.set(value);
            });
        });
    }

    CanvasLayout.prototype.get = function (key) {
        return this[key];
    }

    CanvasLayout.prototype.setBorder = function (size, color, style = "solid") {

        this.border = {
            strokeWidth: size,
            stroke: color,
            strokeStyle: style
        };

        this.set(this.border);
    }

    CanvasLayout.prototype.setBackgroundColor = function (color) {
        this.set({
            fill: color
        });

        this.bgColor = color;
    }

    CanvasLayout.prototype.mergeCol = function (begin, end, ligne = 1) {
        if (typeof this.cell[ligne - 1] === "undefined") {
            return false;
        }

        if (typeof this.cell[ligne - 1][begin - 1] === "undefined" || typeof this.cell[ligne - 1][end - 1] === "undefined") {
            return false;
        }

        this.mergeColVal = {
            begin: begin,
            end: end,
            ligne: ligne
        };

        var w = this.padding / 2 + this.cellWidth * (end - begin + 1) - (this.padding) * (end - begin + 1);
        var h = this.cell[ligne - 1][begin - 1].height;
        var top = this.cell[ligne - 1][begin - 1].top;
        var left = this.cell[ligne - 1][begin - 1].left;

        if(begin == end) {
            w -= this.padding / 2; 
        }
        // Remove the rows cell.

        for (let index = begin - 1; index < end; index++) {
            this.canvas.remove(this.cell[ligne - 1][index]);
            this.cell[ligne - 1][index] = null;
        }

        this.cell[ligne - 1][begin - 1] = new fabric.Rect({
            width: w,
            height: h,
            top: top,
            left: left,
            fill: this.color
        });


        this.canvas.add(this.cell[ligne - 1][begin - 1]);
        this.cell[ligne - 1][begin - 1].set("mergecol", {
            begin:begin, end:end, ligne:ligne
        });

        var nrr = [];

        // Remove empty array.
        for (let index = 0; index < this.cell[ligne - 1].length; index++) {
            if (this.cell[ligne - 1][index] != null) {
                nrr.push(this.cell[ligne - 1][index]);
            }
        }

        this.cell[ligne - 1] = nrr;
        this.colMerge = true;
        return this.colMerge;
    }

    /**
     * Merge layout rows
     * @param {*int} begin 
     * @param {*int} end 
     * @returns {*bool}
     */
    CanvasLayout.prototype.mergeRow = function (begin, end) {

        // Get a new cell size.
        var w = this.cellWidth - this.padding;
        var h = (this.cellHeight * (end - begin + 1)) - (this.padding * (end - begin + 1));

        if (typeof this.cell[begin - 1] === "undefined" || typeof this.cell[end - 1] === "undefined") {
            return false;
        }

        this.mergeRowVal = {
            begin: begin,
            end: end
        };

        if(begin == end) {
            h -= this.padding / 2; 
        }

        // Save col numbers.
        var cell = this.cell[begin - 1].length;
        var top = this.cell[begin - 1][0].top;
        var colMerge = [];
        // Remove active ligne.
        for (var index = begin - 1; index < end; index++) {
            var c = 0;
            this.cell[index].forEach(obj => {
                if( typeof obj.mergecol !== "undefined" ) {
                    colMerge[index] = [];
                    colMerge[index][c] = {
                        width: obj.width,
                        height: obj.height,
                        top: obj.top,
                        left: obj.left
                    };

                    for (let c = (obj.mergecol.end - obj.mergecol.begin); c < 0; c--) {
                        this.canvas.remove(this.cell[obj.mergecol.ligne][c]);
                    }
                }
                this.canvas.remove(obj);
                c+=1;
            });

            this.cell[index] = [];
        }


        // Merge rows array.
        var prev;
        for (var index = 0; index < cell; index++) {
            if(prev != "run") {
                if (this.page == "right") {
                    var left = (this.padding / 2) + this.width + w * index + ((this.padding / 2) * index + 1);
                }
                else {
                    var left = (this.padding / 2) + w * index + ((this.padding / 2) * index + 1);
                }
            }
            else {
                left = left + (this.padding / 2);
            }

            var colw = w, colh = h;

            if( typeof colMerge[begin - 1] !== "undefined" && typeof colMerge[begin - 1][index] !== "undefined" ) {
                colw = colMerge[begin - 1][index].width - this.padding * 2;
                prev = colw + colMerge[begin - 1][index].left;
            }

            this.cell[begin - 1][index] = new fabric.Rect({
                width: colw,
                height: colh,
                top: top + this.padding / 2,
                left: left,
                fill: this.color
            });

            if( typeof prev !== "undefined" && prev != "run") {
                left = prev;
                prev = "run";
            }

            this.canvas.add(this.cell[begin - 1][index]);
        }

        var nrr = [];

        // Remove empty array.
        for (let index = 0; index < this.cell.length; index++) {
            if (this.cell[index].length > 0) {
                nrr.push(this.cell[index]);
            }
        }

        this.cell = nrr;

        this.rowMerge = true;

        return this.rowMerge;
    }

    CanvasLayout.prototype.setPadding = function (padding) {
        this.padding = padding;
    }


    CanvasLayout.prototype.setMarginTop = function (top) {
        this.cell.forEach(arr => {
            arr.forEach(obj => {
                if (!isNaN(parseFloat(top))) {
                    obj.set("top", obj.top + parseFloat(top));
                }
            });
        });
    }

    CanvasLayout.prototype.setMarginLeft = function (left) {
        this.cell.forEach(arr => {
            arr.forEach(obj => {
                if (!isNaN(parseFloat(left))) {
                    obj.set("left", obj.left + parseFloat(left));
                }
            });
        });
    }

    CanvasLayout.prototype.setLayoutStyle = function (style) {

    }

    CanvasLayout.prototype.setWidth = function (width) {
        this.width = width;
        this.remove();
        this.initLayout();
        this.initSetVal();
    }

    CanvasLayout.prototype.setHeight = function (height) {
        this.height = height;
        this.remove();
        this.initLayout();
        this.initSetVal();
    }

    CanvasLayout.prototype.getWidth = function () {
        return this.width;
    }

    CanvasLayout.prototype.getHeight = function () {
        return this.height;
    }

    CanvasLayout.prototype.display = function () {

    }

    CanvasLayout.prototype.remove = function () {
        this.cell.forEach(arr => {
            arr.forEach(obj => {
                this.canvas.remove(obj);
            });
        });

        this.cell = [];
    }

    CanvasLayout.prototype.initSetVal = function () {

        if (typeof this.mergeColVal !== "undefined") {
            this.mergeCol(this.mergeColVal.begin, this.mergeColVal.end, this.mergeColVal.ligne);
        }

        if (typeof this.mergeRowVal !== "undefined") {
            this.mergeRow(this.mergeRowVal.begin, this.mergeRowVal.end);
        }

        if (typeof this.bgColor !== "undefined") {
            this.setBackgroundColor(this.bgColor);
        }

        if (typeof this.border !== "undefined") {
            this.set(this.border);
        }
    }

    CanvasLayout.prototype.setRow = function (row) {
        this.remove();
        this.row = row;
        this.cellHeight = this.height / row;
        this.initLayout();
    }

    CanvasLayout.prototype.setCol = function (col) {
        this.remove();
        this.col = col;
        this.cellWidth = this.width / col;
        this.initLayout();
    }

    CanvasLayout.prototype.lock = function () {
        this.set({
            lockMovementX: "isDisabled",
            lockMovementY: "isDisabled",
            lockRotation: "isDisabled",
            lockScalingX: "isDisabled",
            lockScalingY: "isDisabled",
            lockUniScaling: "isDisabled",
            selectable:false
        });
    }

    CanvasLayout.prototype.unlock = function () {
        this.set({
            lockMovementX: false,
            lockMovementY: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            lockUniScaling: false,
        });
    }

    CanvasLayout.prototype.render = function () {
        this.canvas.calcOffset();
        this.canvas.renderAll();
    }

    CanvasLayout.prototype.sendToBack = function () {
        var canvas = this.canvas;
        this.cell.forEach(arr => {
            arr.forEach(obj => {
                canvas.sendToBack(obj)
            });
        });
    }

    CanvasLayout.prototype.clip = function () {
        const path = "./clip.png";
        var canvas = this.canvas;
        var $this = this;
        this.clipObj();
        this.cloneObj.forEach(function (arr, key) {
            arr.forEach(function (obj, index) {
                fabric.Image.fromURL(path, function (image) {
                    image.scaleToHeight(obj.height);
                    var clipName = generate_uniq_id();
                    obj.fill = "transparent";
                    image.set({
                        top: obj.pos.top,
                        left: obj.pos.left,
                        clipPath: obj,
                        clipName: clipName
                    });

                    $this.cell[key][index].set({
                        clipName: clipName,
                    });
                    canvas.add(image);

                });

            });
        });


        this.render();
    }

    function generate_uniq_id() {
        var $uniq_id = '';

        for (var compt = 0; compt <= 4; compt++) {
            $uniq_id += Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return $uniq_id;
    }


    CanvasLayout.prototype.clipObj = function () {
        var $this = this;
        if (typeof $this.cloneObj === "undefined") {
            $this.cloneObj = [];
            this.cell.forEach(function (arr, key) {
                if (typeof $this.cloneObj[key] === "undefined") {
                    $this.cloneObj[key] = [];
                }
                arr.forEach(function (obj, index) {
                    $this.cloneObj[key][index] = new fabric.Rect({
                        height: obj.height,
                        width: obj.width,
                        originX: 'center',
                        originY: 'center',
                        pos: {
                            top: obj.top,
                            left: obj.left
                        }
                    });
                    //$this.cloneObj[key][index].set("fill","transparent");
                    $this.cloneObj[key][index].set({
                        lockMovementX: "isDisabled",
                        lockMovementY: "isDisabled",
                        lockRotation: "isDisabled",
                        lockScalingX: "isDisabled",
                        lockScalingY: "isDisabled",
                        lockUniScaling: "isDisabled",
                    })
                });
            });
        }
    }

    CanvasLayout.prototype.getObjects = function() {
        return this.cell;
    }

    return CanvasLayout;
})();