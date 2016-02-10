//var Game(){
//    
//};

function Player(name,color){
    this.name = name;
    this.color = color;
    this.score = 0;
};


function Point(crdX,crdY){
    this.crdX = crdX;
    this.crdY = crdY;
};

function Line(point1,point2){
    this.ponint1 = point1;
    this.ponint2 = point2;
};

function Square(){
    
};

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var x = 250;
var y = 70;

        
    for(x=250;x<=850;x+=100){ 
        for(y=70;y<=560;y+=70){
            ctx.beginPath();
            ctx.arc(x,y,5,0,2*Math.PI);
            ctx.fill();
        } 
    }