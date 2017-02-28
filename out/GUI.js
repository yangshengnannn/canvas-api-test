var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.matrix = null;
        this.globalMatrix = null;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1; //默认相对alpha
        this.globalAlpha = 1; //默认全局alpha                             
        this.parent = null;
        this.eventArray = [];
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    DisplayObject.prototype.remove = function () { };
    ;
    //点击判断函数，返回值代表是否被点击。
    DisplayObject.prototype.addEventListener = function (type, func, targetDisplayObject, ifCapture) {
        var e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
    };
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation); //初始化矩阵
        //计算全局Alpha值
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.children = [];
    }
    DisplayObjectContainer.prototype.addChild = function (child) {
        this.children.push(child);
        child.parent = this;
    };
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var displayObject = _a[_i];
            displayObject.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.removeChild = function (displayObject) {
        var tempArray = this.children.concat();
        for (var _i = 0, tempArray_1 = tempArray; _i < tempArray_1.length; _i++) {
            var each = tempArray_1[_i];
            if (each == displayObject) {
                var index = this.children.indexOf(each);
                tempArray.splice(index, 1);
                this.children = tempArray;
                return;
            }
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        if (this.eventArray.length != 0) {
            EventManager.getInstance().targetDisplayObjcetArray.push(this);
        }
        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix));
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y); //遍历
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.size = 15;
        this.font = "Arial";
        this.color = "";
    }
    TextField.prototype.render = function (context2D) {
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, this.x, this.y);
        context2D.fillStyle = this.color;
    };
    TextField.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        rect.width = 10 * this.text.length;
        rect.height = 20;
        var point = new math.Point(x, y);
        if (rect.isPointInRectangle(point)) {
            if (this.eventArray.length != 0) {
                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
    }
    Bitmap.prototype.render = function (context2D) {
        context2D.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    };
    Bitmap.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        rect.x = 0;
        rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        //alert("22");
        if (rect.isPointInRectangle(new math.Point(x, y))) {
            if (this.eventArray.length != 0) {
                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            return this;
        }
        else {
            return null;
        }
    };
    Bitmap.prototype.addEventListener = function (type, func, targetDisplayObject, ifCapture) {
        var e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
    };
    return Bitmap;
}(DisplayObject));
var TheEvent = (function () {
    function TheEvent(type, func, targetDisplayObject, ifCapture) {
        this.type = "";
        this.ifCapture = false;
        this.type = type;
        this.ifCapture = ifCapture;
        this.func = func;
        this.targetDisplayObject = targetDisplayObject;
    }
    return TheEvent;
}());
var EventManager = (function () {
    function EventManager() {
    }
    EventManager.getInstance = function () {
        if (EventManager.eventManager == null) {
            EventManager.eventManager = new EventManager();
            EventManager.eventManager.targetDisplayObjcetArray = new Array();
            return EventManager.eventManager;
        }
        else {
            return EventManager.eventManager;
        }
    };
    return EventManager;
}());
//# sourceMappingURL=GUI.js.map