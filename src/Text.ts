
        /*
        变换
        1.任何一个显示对象需要两个矩阵（全局与相对）
        2.把显示对象的属性转换为自己的相对矩阵
        3.把现实对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
        4.对渲染上下文设置显示对象的全局矩阵
        5.根容器的相对矩阵就是全局矩阵
        */


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

//scene
//  |-- people(0,100)/ lovalMatrix-wander =>(50,-50)
//      |--glasses(0,100)/localMatrix =>(50,-150)
//      |--clothes
//捕获/冒泡机制
//冒泡：当用户点击到一个物体后，被点击的物体通知其所有父级。例如用户点击眼镜，眼镜通知人。
//捕获：由上至下，为了执行一些高级逻辑。先执行捕获阶段的侦听器，再执行冒泡阶段。
