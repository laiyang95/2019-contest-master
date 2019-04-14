var can=document.getElementById('canvas');
var msg=document.getElementById('msg');
var cxt=can.getContext('2d');
var w=25,h=25; //每格的像素
var curMap; //当前的地图
var curLevel;//当前的等级地图
var curMan;//小人
var iCurlevel=0;//关卡数
var moveTimes=0;//移动了多少次

var oImgs={
    "block" : "images/block.png",
    "wall" : "images/wall.png",
    "box" : "images/box.png",
    "ball" : "images/ball.png",
    "up" : "images/up.png",
    "down" : "images/down.png",
    "left" : "images/left.png",
    "right" : "images/right.png",
}
//预加载所有图片
function imgPreload(srcs,callback) {
    var count=0,imgNum=0,images={};
    for(src in srcs){
        imgNum++;
    }
    for(src in srcs){
        images[src]=new Image();
        images[src].onload=function () {
            //判断是否所有的图片都预加载完成
            if(++count>=imgNum){
                callback(images);
            }
        }
        images[src].src=srcs[src];
    }
}
var block,wall,box,ball,up,down,left,right,bg;
imgPreload(oImgs,function (images) {
//        console.log(images.block);
    block=images.block;
    wall=images.wall;
    box=images.box;
    ball=images.ball;
    up=images.up;
    down=images.down;
    left=images.left;
    right=images.right;
    bg=images.bg;
    init();
});
//初始化游戏
function init() {
    initLevel();//初始化对应等级的游戏
    showMoveInfo();//初始化对应等级的游戏数据
}
//绘制地板
function InitMap() {
    for(var i=0;i<16;i++){
        for(var j=0;j<16;j++){
            cxt.drawImage(block,w*j,h*i,w,h);
        }
    }
}
//小人位置坐标
function Point(x,y) {
    this.x=x;
    this.y=y;
}
var perPosition=new Point(5,5);//小人的初始坐标值

//绘制每个游戏关卡地图
function DrawMap(level) {
    for(var i=0;i<level.length;i++){
        for(var j=0;j<level[i].length;j++){
            var pic=block;//初始图片
            switch (level[i][j]){
                case 1://绘制墙壁
                    pic=wall;
                    break;
                case 2://绘制位置
                    pic=ball;
                    break;
                case 3://绘制箱子
                    pic=box;
                    break;
                case 4://绘制小人
                    pic=curMan;//小人有四个方向，具体显示要和上下左右方位值关联
                    //获取小人的坐标位置
                    perPosition.x=i;
                    perPosition.y=j;
                    break;
            }
            //每个图片不一样宽，需要在对应的地板中心绘制地图
            cxt.drawImage(pic,w*j-(pic.width-w)/2,h*i-(pic.height-h),pic.width,pic.height);
        }
    }
}
//初始化游戏等级
function initLevel() {
    curMap=copyArray(levels[iCurlevel]);//当前移动过的游戏地图
    curLevel=copyArray(levels[iCurlevel]);//当前等级初始地图
    curMan=down;//初始化小人
    InitMap();//初始化地板
    DrawMap(curMap);//绘制出当前等级的地图
}
//下一关
function NextLevel(i) {
    //iCurlevel当前的地图关数
    iCurlevel=iCurlevel+i;
    if(iCurlevel<0){
        iCurlevel=0;
        return;
    }
    var len=levels.length;
    if(iCurlevel>len-1){
        iCurlevel=len-1;
    }
    initLevel();//初始化当前等级关卡
    moveTimes=0;//游戏关卡 移动步数清零
    showMoveInfo();//初始化当前关卡数据
}

//选关
function ChooseLevel(i) {
    //iCurlevel当前的地图关数
    iCurlevel=i;
    if(iCurlevel<0){
        iCurlevel=0;
        return;
    }
    var len=levels.length;
    if(iCurlevel>len-1){
        iCurlevel=len-1;
    }
    initLevel();//初始化当前等级关卡
    moveTimes=0;//游戏关卡 移动步数清零
    showMoveInfo();//初始化当前关卡数据
}
//小人移动
function go(dir) {
    var p1,p2;
    switch (dir){
        case "up":
            curMan=up;
            p1=new Point(perPosition.x-1,perPosition.y);
            p2=new Point(perPosition.x-2,perPosition.y);
            break;
        case "down":
            curMan=down;
            p1=new Point(perPosition.x+1,perPosition.y);
            p2=new Point(perPosition.x+2,perPosition.y);
            break;
        case "left":
            curMan=left;
            p1=new Point(perPosition.x,perPosition.y-1);
            p2=new Point(perPosition.x,perPosition.y-2);
            break;
        case "right":
            curMan=right;
            p1=new Point(perPosition.x,perPosition.y+1);
            p2=new Point(perPosition.x,perPosition.y+2);
            break;
    }
    //如果小人能够移动的话，更新游戏数据，并重绘地图
    if(Trygo(p1,p2)){
        moveTimes++;
        showMoveInfo();
    }
    //重绘地图
    InitMap();
    DrawMap(curMap);
    //如果移动完成了进入下一关
    if(checkFinsh()){
        alert("恭喜过关！");
        NextLevel(1);
    }
}
//判断是否推成功
function checkFinsh(){
    for(var i=0;i<curMap.length;i++){
        for(var j=0;j<curMap[i].length;j++){
            if(curLevel[i][j]==2&&curMap[i][j]!=3){
                return false;
            }
        }
    }
    return true;
}
//判断小人是否能够移动
function Trygo(p1,p2) {
    if(p1.x<0){
        return false;//若果超出地图的上边，不通过
    }
    if(p1.y<0){
        return false;//若果超出地图的左边，不通过
    }
    if(p1.x>curMap.length){
        return false;//若果超出地图的下边，不通过
    }
    if(p1.y>curMap[0].length){
        return false;//若果超出地图的右边，不通过
    }
    if(curMap[p1.x][p1.y]==1){
        return false;//如果前面是墙，不通过
    }
    if(curMap[p1.x][p1.y]==3){
        if(curMap[p2.x][p2.y]==1||curMap[p2.x][p2.y]==3){
            return false;
        }
        //如果判断不成功小人前面的箱子前进一步
        curMap[p2.x][p2.y]=3;
    }
    //如果都没判断成功小人前进一步
    curMap[p1.x][p1.y]=4
    //如果小人前进了一步，小人原来的位置如何显示
    var v=curLevel[perPosition.x][perPosition.y];
    if(v!=2){//如果刚开始小人位置不是陷阱的话

            v=0;//小人移开之后之前小人的位置改为地板
    }
    //重置小人位置的参数
    curMap[perPosition.x][perPosition.y]=v;
    //如果判断小人前进了一步，更新坐标值
    perPosition=p1;
    //如果小人动了  返回true指代能够移动小人
    return true;
}
//判断是否推成功
//与键盘的上下左右键关联
function doKeyDown(event) {
    switch (event.keyCode){
        case 37://左箭头
            go("left");
            break;
        case 38://上箭头
            go("up");
            break;
        case 39://右箭头
            go("right");
            break;
        case 40://下箭头
            go("down");
            break;
    }

}

function showMoveInfo(){
    msg.innerHTML = "第" + (iCurlevel+1) +"关 移动次数: "+ moveTimes;
}
//游戏说明
var showhelp = false;
function showHelp(){
    showhelp = !showhelp;
    if (showhelp)
    {
        msg.innerHTML = "用键盘上的上、下、左、右键移动小人，把箱子全部推到小球的位置即可过关。箱子只可向前推，不能往后拉，并且小人一次只能推动一个箱子。";
    }else{
        showMoveInfo();
    }
}
//克隆二维数组
function copyArray(arr) {
    var b=[];
    for(var i=0;i<arr.length;i++){
        b[i]=arr[i].concat();
    }
    return b;
}
document.getElementById("relevel").onclick= function () {
    if(document.getElementById("levelnow").value>0&&document.getElementById("levelnow").value<51){
        level=document.getElementById("levelnow").value;
        //数组为0-49，而关数为1-50，所以将level-1与数组匹配
        level--;
        ChooseLevel(level);
    }else{
        //如果输入的关数（level）不符合条件，弹出提醒
        document.getElementById("levelnow").value="choose 1-50"
    }
}
