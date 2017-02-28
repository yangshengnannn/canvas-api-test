window.onload = () => {
    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();



    //处理图片


    //context2D.drawImage(image, 0, 0);//未加载完成，无法显示图片

    setInterval(() => {
        context2D.clearRect(0, 0, canvas.width, canvas.height);//在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D);
    }, 30)//每30毫秒刷新一次
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


    var image = document.createElement("img");//创建空壳
    image.src = "IMG_0515.JPG";//指定图片

    var bitmap = new Bitmap();
    bitmap.image = image;
    bitmap.y = 40;
    bitmap.x = 50;
    bitmap.scaleX = 0.5;
    bitmap.scaleY = 0.5;
    bitmap.addEventListener("onclick", () => {

    }, this, false);

    var moveList = new DisplayObjectContainer();
    moveList.addEventListener("onmousemove", (e: MouseEvent) => {

        var yChange = currentY - lastY;
        moveList.y = moveList.y + yChange;

    }, this, false);



    image.onload = () => {//加载图片、文字与封装API等

        stage.addChild(moveList);
        moveList.addChild(bitmap);
        moveList.addChild(tf1);
        moveList.addChild(tf2);
        //stage.removeChild(tf1);
    }

    var currentX: number;
    var currentY: number;
    var lastX: number;
    var lastY: number;

    var isMouseDown = false;//检测鼠标是否按下
    var hitResult: DisplayObject;//检测是否点到控件


    window.onmousedown = (e) => {

        isMouseDown = true;
        let targetDisplayObjectArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjectArray.splice(0, targetDisplayObjectArray.length);
        hitResult = stage.hitTest(e.offsetX, e.offsetY);
        currentX = e.offsetX;
        currentY = e.offsetY;

    }


    window.onmousemove = (e) => {

        let targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        lastX = currentX;
        lastY = currentY;
        currentX = e.offsetX;
        currentY = e.offsetY;

        if (isMouseDown) {

            for (let i = 0; i < targetDisplayObjcetArray.length; i++) {

                for (let event of targetDisplayObjcetArray[i].eventArray) {

                    if (event.type.match("onmousemove") && event.ifCapture) {

                        event.func(e);
                    }
                }
            }

            for (let i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {

                for (let event of targetDisplayObjcetArray[i].eventArray) {

                    if (event.type.match("onmousemove") && !event.ifCapture) {

                        event.func(e);
                    }
                }
            }
        }
    }


    window.onmouseup = (e) => {

        isMouseDown = false;
        let targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjcetArray.splice(0, targetDisplayObjcetArray.length);
        let newHitRusult = stage.hitTest(e.offsetX, e.offsetY)

        for (let i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {

            for (let event of targetDisplayObjcetArray[i].eventArray) {

                if (event.type.match("onclick") && newHitRusult == hitResult) {

                    event.func(e);
                }
            }
        }
    }

};









