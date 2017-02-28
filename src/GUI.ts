abstract class DisplayObject implements Drawable {

    matrix: math.Matrix = null;
    globalMatrix: math.Matrix = null;

    x: number = 0;
    y: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    rotation: number = 0;

    alpha: number = 1;//默认相对alpha
    globalAlpha: number = 1;//默认全局alpha                             
    parent: DisplayObject = null;
    remove() { };

    touchEnabled: boolean;
    eventArray: TheEvent[] = [];
    constructor() {

        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();

    }
    //点击判断函数，返回值代表是否被点击。
    addEventListener(type: string, func: Function, targetDisplayObject: DisplayObject, ifCapture: boolean) {

        let e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
    }
    draw(context2D: CanvasRenderingContext2D) {


        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);//初始化矩阵

        //计算全局Alpha值
        if (this.parent) {

            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);

        } else {

            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;

        }

        context2D.globalAlpha = this.globalAlpha;

        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);

    }

    abstract render(context2D: CanvasRenderingContext2D);

    abstract hitTest(x: number, y: number): DisplayObject;

}

class DisplayObjectContainer extends DisplayObject {

    children: DisplayObject[] = [];


    addChild(child: DisplayObject) {

        this.children.push(child);
        child.parent = this;

    }

    render(context2D: CanvasRenderingContext2D) {

        for (let displayObject of this.children) {

            displayObject.draw(context2D);
        }
    }

    removeChild(displayObject: DisplayObject) {

        var tempArray = this.children.concat();
        for (let each of tempArray) {

            if (each == displayObject) {

                var index = this.children.indexOf(each);
                tempArray.splice(index, 1);
                this.children = tempArray;
                return;
            }
        }
    }

    hitTest(x: number, y: number) {
        if (this.eventArray.length != 0) {

            EventManager.getInstance().targetDisplayObjcetArray.push(this);
        }
        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            let pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix));

            let hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);//遍历
            if (hitTestResult) {
                return hitTestResult;
            }
        }

        return null;
    }


}

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
    remove();
}


class TextField extends DisplayObject {

    text: string = "";
    size: number = 15;
    font: string = "Arial";
    color: string = "";

    render(context2D: CanvasRenderingContext2D) {
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, this.x, this.y);
        context2D.fillStyle = this.color;
    }
    hitTest(x: number, y: number) {
        var rect = new math.Rectangle();
        rect.width = 10 * this.text.length;
        rect.height = 20;
        var point = new math.Point(x, y);
        if (rect.isPointInRectangle(point)) {

            if (this.eventArray.length != 0) {

                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            return this;
        } else {
            return null;
        }

    }
}

class Bitmap extends DisplayObject {

    image: HTMLImageElement;

    constructor() {

        super();


    }

    render(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }

    hitTest(x: number, y: number) {
        let rect = new math.Rectangle();
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
        } else {
            return null;
        }
    }
    addEventListener(type: string, func: Function, targetDisplayObject: DisplayObject, ifCapture: boolean) {

        let e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
    }

}


class TheEvent {

    type = "";
    ifCapture = false;
    targetDisplayObject: DisplayObject;
    func: Function;

    constructor(type: string, func: Function, targetDisplayObject: DisplayObject, ifCapture: boolean) {

        this.type = type;
        this.ifCapture = ifCapture;
        this.func = func;
        this.targetDisplayObject = targetDisplayObject;

    }
}

class EventManager {

    targetDisplayObjcetArray: DisplayObject[];
    static eventManager: EventManager;

    static getInstance() {
        if (EventManager.eventManager == null) {

            EventManager.eventManager = new EventManager();
            EventManager.eventManager.targetDisplayObjcetArray = new Array();
            return EventManager.eventManager;

        } else {

            return EventManager.eventManager;
        }
    }
}
