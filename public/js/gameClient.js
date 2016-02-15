var connection = undefined;
var game = undefined;
var loadingContainer = new createjs.Container();
//var loadingContainer = createjs.Container();

//Canvas
var canvas = document.getElementById("myCanvas");
// Cria o stage com id = myCanvas
var stage = new createjs.Stage("myCanvas");

createjs.Touch.enable(stage);

createjs.Ticker.addEventListener("tick", stage);

var text = new createjs.Text("Aguardando jogadores...", "15px Arial", "#000000");
text.regX = text.width / 2;
text.regY = text.height / 2;
text.x = canvas.width / 2 - 90;
text.y = canvas.height / 2;
text.textBaseline = "alphabetic";

createjs.Tween.get(text, {
    loop: true
}).to({
    text: "Aguardando jogadores..."
}, 500);

stage.addChild(loadingContainer);
loadingContainer.addChild(text);
var pointTime = 100;
for (j = 170; j <= 370; j += 200) {
    var auxX = 0;
    for (i = 500; i <= 700; i += 200) {

        var circle = new createjs.Shape();
        circle.cursor = "pointer";
        circle.name = "target";
        circle.graphics.beginFill("#000").drawCircle(0, 0, 6);
        circle.x = i;
        circle.y = j;

        circle.on("mousedown", function (e) {
            mousePress(e, new_point);
        });

        loadingContainer.addChild(circle);

        circle.scaleX = 0;
        circle.scaleY = 0;
        createjs.Tween.get(circle, {
            loop: true
        }).wait(pointTime).to({
            scaleX: 1,
            scaleY: 1
        }, 1000, createjs.Ease.elasticOut).to({
            scaleX: 0,
            scaleY: 0
        }, 1000);
        pointTime += 100;
    }
}

function validateMove(point1, point2) {
    var a = Math.abs(point1.crdX - point2.crdX);
    var b = Math.abs(point1.crdY - point2.crdY);

    for (line of game.lines) {
        if (line.ponint1.crdX == point1.crdX && line.ponint1.crdY == point1.crdY &&
            line.ponint2.crdX == point2.crdX && line.ponint2.crdY == point2.crdY) {

            return false;

        }
    }


    if (a > 0 && b > 0) {
        return false;
    } else if (a > 100 || b > 100) {
        return false;
    } else {
        return true;
    }
}

function introAnimation() {

    //habilita o mouseover no stage
    createjs.Tween.get(loadingContainer).to({
        alpha: 0
    }, 500).call(function () {
        stage.removeChild(loadingContainer);
    });
    stage.enableMouseOver(20);


    var pointTime = 50;
    for (j = 70; j <= 560; j += 100) {
        var auxX = 0;
        for (i = 300; i <= 900; i += 100) {

            (function () {
                var circle = new createjs.Shape();
                circle.cursor = "pointer";
                circle.name = "target";
                circle.graphics.beginFill("#000").drawCircle(0, 0, 6);
                circle.x = i;
                circle.y = j;

                var hitArea = new createjs.Shape();
                hitArea.graphics.beginFill("#000").drawCircle(0, 0, 30);
                circle.hitArea = hitArea;


                circle.on("mousedown", function (e) {
                    mousePress(e, new_point);
                });

                stage.addChild(circle);

                circle.scaleX = 0;
                circle.scaleY = 0;
                createjs.Tween.get(circle).wait(pointTime).to({
                    scaleX: 1,
                    scaleY: 1,
                }, 1000, createjs.Ease.elasticOut);
                pointTime += 50;

                var new_point = new Point(i, j);

                game.points.push(new_point);
            })();
        }
    }
}

function mousePress(event, point) {
    connection = new createjs.Shape().set({
        x: event.target.x,
        y: event.target.y,
        mouseEnabled: false,
        graphics: new createjs.Graphics().s("#00f").dc(0, 0, 50)
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
        .mt(0, 0).lt(stage.mouseX - connection.x, stage.mouseY - connection.y);
}

function fimLinha(event, first_point) {
    var target, targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].name == "target") {
            target = targets[i];
            break;
        }
    }

    var last_point;
    if (target) {
        game.points.filter(function (el) {
            if (el.crdX == target.x && el.crdY == target.y)
                last_point = el;
        });
    }

    if (target != null && validateMove(first_point, last_point)) {
        connection.graphics.clear().s("red").mt(0, 0).lt(target.x - connection.x, target.y - connection.y);

        var line = {
            ponint1: first_point,
            ponint2: last_point
        };

        game.lines.push(line);

        socket.emit("play", line);

    } else {
        stage.removeChild(connection);
    }

    stage.removeEventListener("stagemousemove", desenhaLinha);

}

function drawLine(line) {
    var connection = new createjs.Shape();
    stage.addChild(connection);
    connection.graphics.clear();
    connection.graphics.setStrokeStyle(3);
    connection.graphics.beginStroke("#ff3333");
    connection.graphics.moveTo(line.ponint1.crdX, line.ponint1.crdY);
    connection.graphics.lineTo(line.ponint2.crdX, line.ponint2.crdY);

    connection.alpha = 0;

    createjs.Tween.get(connection).to({
        alpha: 1
    }, 500);

}


function placar(){
    var ctnPlacar = new createjs.Container();
    ctnPlacar.x = 0;
    ctnPlacar.y = 0;
    
    
    var myRect = new createjs.Shape();
    myRect.graphics.beginFill("DeepSkyBlue").drawRect(0, 0, 500,100);
    myRect.width = myRect.graphics.command.w;
    myRect.height = myRect.graphics.command.h;
    myRect.x = 0;
    myRect.y = 0;
    stage.addChild(myRect);


    var placarTitulo = new createjs.Text("Placar", "30px Arial", "#000000");
    placarTitulo.x = myRect.width/2 - 55;
    placarTitulo.y = 0;
    ctnPlacar.addChild(placarTitulo);

    
    var tituloPlayer01 = new createjs.Text("Player 1", "30px Arial", "#000000");
    tituloPlayer01.x = 0;
    tituloPlayer01.y = 0.2*myRect.height;
    ctnPlacar.addChild(tituloPlayer01);
    
    var valorPlayer01 = new createjs.Text(3, "30px Arial", "#000000");
    valorPlayer01.x = 0;
    valorPlayer01.y = 0.5*myRect.height;
    ctnPlacar.addChild(valorPlayer01);
    
    var tituloPlayer02 = new createjs.Text("Player 2", "30px Arial", "#000000");
    tituloPlayer02.x = 0.4*myRect.width;
    tituloPlayer02.y = 0.2*myRect.height;
    ctnPlacar.addChild(tituloPlayer02);
    
    var valorPlayer02 = new createjs.Text(8, "30px Arial", "#000000");
    valorPlayer02.x = 0.3*myRect.width;
    valorPlayer02.y = 0.5*myRect.height;
    ctnPlacar.addChild(valorPlayer02);

    var tituloPlayer03 = new createjs.Text("Player 3", "30px Arial", "#000000");
    tituloPlayer03.x = 0;
    tituloPlayer03.y = 0.2*myRect.height;
    ctnPlacar.addChild(tituloPlayer03);
    
    var valorPlayer03 = new createjs.Text(6, "30px Arial", "#000000");
    valorPlayer03.x = 0.6*myRect.width;
    valorPlayer03.y = 0.5*myRect.height;
    ctnPlacar.addChild(valorPlayer03);
    
    stage.addChild(ctnPlacar);
}

function tick(event) {
    stage.update();
}

placar();