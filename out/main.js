var _this = this;
window.onload = function () {
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();
    //处理图片
    //context2D.drawImage(image, 0, 0);//未加载完成，无法显示图片
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D);
    }, 30); //每30毫秒刷新一次
    //局部渲染：仅渲染整个场景中改变的一部分，但是需要更大的内存空间来计算
    var tf1 = new TextField();
    tf1.text = "LET US";
    tf1.x = 80;
    tf1.y = 20;
    tf1.size = 20;
    var tf2 = new TextField();
    tf2.text = "SKIING";
    tf2.x = 130;
    tf2.y = 20;
    tf2.size = 20;
    var image = document.createElement("img"); //创建空壳
    image.src = "IMG_0515.JPG"; //指定图片
    var bitmap = new Bitmap();
    bitmap.image = image;
    bitmap.y = 40;
    bitmap.x = 50;
    bitmap.scaleX = 0.5;
    bitmap.scaleY = 0.5;
    bitmap.addEventListener("onclick", function () {
    }, _this, false);
    var moveList = new DisplayObjectContainer();
    moveList.addEventListener("onmousemove", function (e) {
        var yChange = currentY - lastY;
        moveList.y = moveList.y + yChange;
    }, _this, false);
    image.onload = function () {
        stage.addChild(moveList);
        moveList.addChild(bitmap);
        moveList.addChild(tf1);
        moveList.addChild(tf2);
        //stage.removeChild(tf1);
    };
    var currentX;
    var currentY;
    var lastX;
    var lastY;
    var isMouseDown = false; //检测鼠标是否按下
    var hitResult; //检测是否点到控件
    window.onmousedown = function (e) {
        isMouseDown = true;
        var targetDisplayObjectArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjectArray.splice(0, targetDisplayObjectArray.length);
        hitResult = stage.hitTest(e.offsetX, e.offsetY);
        currentX = e.offsetX;
        currentY = e.offsetY;
    };
    window.onmousemove = function (e) {
        var targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        lastX = currentX;
        lastY = currentY;
        currentX = e.offsetX;
        currentY = e.offsetY;
        if (isMouseDown) {
            for (var i = 0; i < targetDisplayObjcetArray.length; i++) {
                for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                    var event_1 = _a[_i];
                    if (event_1.type.match("onmousemove") && event_1.ifCapture) {
                        event_1.func(e);
                    }
                }
            }
            for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
                for (var _b = 0, _c = targetDisplayObjcetArray[i].eventArray; _b < _c.length; _b++) {
                    var event_2 = _c[_b];
                    if (event_2.type.match("onmousemove") && !event_2.ifCapture) {
                        event_2.func(e);
                    }
                }
            }
        }
    };
    window.onmouseup = function (e) {
        isMouseDown = false;
        var targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjcetArray.splice(0, targetDisplayObjcetArray.length);
        var newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
        for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
            for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                var event_3 = _a[_i];
                if (event_3.type.match("onclick") && newHitRusult == hitResult) {
                    event_3.func(e);
                }
            }
        }
    };
};
//# sourceMappingURL=main.js.map