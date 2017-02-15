window.onload = () => {
    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");

    /*context2D.setTransform(1, 0, 0, 1, 50, 50);//设置坐标，1,0,0,1表示矩阵 
    //1   0   50
    //0   1   50
    //0   0   1   2D中永远是001所以忽略

    //画一个形状（fillrect）
    context2D.fillStyle = "#FF0000";
    context2D.strokeStyle = "#00FF00";

    context2D.moveTo(10, 10);

    context2D.lineTo(150, 50);
    context2D.lineTo(10, 50);

    context2D.rect(0, 0, 100, 100);

    context2D.fill();//填充
    context2D.stroke();//描边

    //写文字
    context2D.fillText("Hello,World", 0, 0);
    context2D.measureText("111").width//测量一行文字的宽


*/
    //处理图片


    //context2D.drawImage(image, 0, 0);//未加载完成，无法显示图片

    var stage = new DisplayObjectContainer();
    setInterval(() => {
        context2D.clearRect(0, 0, canvas.width, canvas.height);//在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D);
    }, 30)//每30毫秒刷新一次
    //局部渲染：仅渲染整个场景中改变的一部分，但是需要更大的内存空间来计算
    var tf1 = new TextField();
    tf1.text = "GO";
    tf1.x = 50;
    tf1.y = 70;
    tf1.size = 30;
    var tf2 = new TextField();
    tf2.text = "SKIING";
    tf2.x = 150;
    tf2.y = 70;
    tf2.size = 35;

    var image = document.createElement("img");//创建空壳
    image.src = "IMG_1024.JPG";//指定图片
    let bitmap1 = new Bitmap();
    bitmap1.image = image;

    var bitmap = new Bitmap();
    bitmap.image = image;
    bitmap.width = 300;
    bitmap.height = 270;
    bitmap.y=80;

    image.onload = () => {//加载图片、文字与封装API等
        stage.addChild(bitmap);
        stage.addChild(tf1);
        stage.addChild(tf2);
    }




};
class DisplayObject implements Drawable {

    x: number = 0;
    y: number = 0;

    draw(context2D: CanvasRenderingContext2D) {
    }
}

class TextField extends DisplayObject {

    text: string = "";
    size: number = 30;
    font: string = "Arial";

    draw(context2D: CanvasRenderingContext2D) {
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, this.x, this.y);
    }
}

class Bitmap extends DisplayObject {

    image: HTMLImageElement;
    width: number;
    height: number;


    draw(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class DisplayObjectContainer implements Drawable {

    array: Drawable[] = [];

    addChild(displayObject: DisplayObject) {
        this.array.push(displayObject);
    }

    draw(context2D: CanvasRenderingContext2D) {
        for (let drawable of this.array) {
            drawable.draw(context2D);
        }
    }

}

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
}

