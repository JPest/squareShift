Objetos do Game
var game {
    squares:[],//Quadrados aqui
    filledSquareCount:0,
    roundPlayer:[],//Jogadores aqui
    validateMove: function (point1, point1){
                        var a = Math.abs(point1.crdX - point2.crdX);
                        var b = Math.abs(point1.crdY - point2.crdY);
                        if( !(a>0 && b>0) ){
                            return true;
                        }else{
                            return false;
                        }
                    },    
        
};

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
    this.filled = false;
    this.color = "";
    this.points =[];// Pontos aqui
    this.lines = [];// Linhas aqui
};

//Canvas
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