//Objetos do Game
var game = {
    squares:[],//Quadrados aqui
    filledSquareCount:0,
    roundPlayer:[],//Jogadores aqui
    validateMove: function (point1, point2){
                        var a = Math.abs(point1.crdX - point2.crdX);
                        var b = Math.abs(point1.crdY - point2.crdY);
                        if (a>0 && b>0){
                            return false;
                        }else if(a>100 || b>100){
                            return false;
                        }else{
                            return true;
                        }
                    }    
        
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
var canvas = document.getElementById("myCanvas");
// Cria o Canvas com id = myCanvas
var stage = new createjs.Stage("myCanvas");

createjs.Ticker.addEventListener("tick", stage);

//habilita o mouseover no stage
stage.enableMouseOver(20);

var connection = null;

var i=0;
var j=0;

var myPoints = [] ;

//j=70;j<=560;j+=100
//i=250;i<=850;i+=100


for(j=70;j<=560;j+=100){
    var auxX = 0;
    for(i=250;i<=850;i+=100){
        var _i = i;
        var _j = j;
        
        (function() {
            var circle = new createjs.Shape().set({
                x: _i,
                y: _j,
                cursor: "pointer",
                name:"target"

            });
            circle.graphics.f(createjs.Graphics.getRGB("fff"))
                .dc(0,0,6);
            stage.addChild(circle);
            var new_point = new Point(_i,_j);
            circle.on("mousedown", function(e) {
                mousePress(e, new_point);
            });
            myPoints.push(new_point);
        })();
    } 
}

function mousePress(event, point) {
    connection = new createjs.Shape().set({
        x:event.target.x, 
        y:event.target.y,
        mouseEnabled:false,
        graphics: new createjs.Graphics().s("#00f").dc(0,0,50)
    });
    stage.addChild(connection);
    stage.addEventListener("stagemousemove", desenhaLinha);
    stage.addEventListener("stagemouseup", mouse_point_getter);
                           
    function mouse_point_getter(e) {
        fimLinha(e, point);
        stage.removeEventListener("stagemouseup", mouse_point_getter);
    }
}

function desenhaLinha(event) {
    connection.graphics.clear()
        .s("#f00")
        .mt(0,0).lt(stage.mouseX-connection.x, stage.mouseY-connection.y);
}

function fimLinha(event, first_point) {
    var target, targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
    for (var i=0; i<targets.length; i++) {
        if (targets[i].name == "target") { 
            target = targets[i];
            console.log("te amo"); 
            break; 
        }   
    }
    
    var last_point;
    if(target) {
        myPoints.filter(function(el) {
            if(el.crdX == target.x && el.crdY == target.y)
                last_point = el;
        });
    }
    
    if (target != null && game.validateMove(first_point, last_point)) {
        connection.graphics.clear()
        .s("red")
        .mt(0,0).lt(target.x-connection.x, target.y-connection.y);
        
    } else {
        stage.removeChild(connection);
    }
    
    stage.removeEventListener("stagemousemove", desenhaLinha);
    
}

function tick(event) {
    stage.update();
}