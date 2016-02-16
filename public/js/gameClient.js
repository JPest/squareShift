var connection = new createjs.Shape();
var game = undefined;
var loadingContainer = new createjs.Container();
var mouseDownTarget;

//Canvas
var canvas = document.getElementById("myCanvas");
// Cria o stage com id = myCanvas
var stage = new createjs.Stage("myCanvas");

var lineContainer = new createjs.Container();
var squareContainer = new createjs.Container();
var pointContainer = new createjs.Container();

stage.addChild(lineContainer);
stage.addChild(squareContainer);
stage.addChild(pointContainer);

createjs.Touch.enable(stage);

createjs.Ticker.addEventListener("tick", stage);

createLoadingScreen();

stage.addEventListener("stagemousedown", mousePress);

function createLoadingScreen() {

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

}

function validateMove(point1, point2) {
    var a = Math.abs(point1.x - point2.x);
    var b = Math.abs(point1.y - point2.y);

    var name = lineName(point1, point2);

    if (game.lines[name].filled == true) {

        return false;

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
    var lineArray = [];
    for (lineOfPoints of game.points) {
        for (point of lineOfPoints) {

            var circle = new createjs.Shape();
            circle.cursor = "pointer";
            circle.name = "target";
            circle.graphics.beginFill("#000").drawCircle(0, 0, 6);
            circle.x = point.x;
            circle.y = point.y;

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawCircle(0, 0, 50);
            circle.hitArea = hitArea;

            pointContainer.addChild(circle);

            circle.scaleX = 0;
            circle.scaleY = 0;
            createjs.Tween.get(circle).wait(pointTime).to({
                scaleX: 1,
                scaleY: 1,
            }, 1000, createjs.Ease.elasticOut);
            pointTime += 50;

        }
    }
}

function mousePress(event) {

    var targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].name == "target") {
            mouseDownTarget = targets[i];
            break;
        }
    }

    if (mouseDownTarget) {

        connection = new createjs.Shape().set({
            x: mouseDownTarget.x,
            y: mouseDownTarget.y,
            mouseEnabled: false
        });
        lineContainer.addChild(connection);
        stage.addEventListener("stagemousemove", desenhaLinha);
        stage.addEventListener("stagemouseup", fimLinha);
    }
}

function desenhaLinha(event) {
    connection.graphics.clear()
        .s(player.color)
        .mt(0, 0).lt(stage.mouseX - connection.x, stage.mouseY - connection.y);
}

function fimLinha(event) {

    stage.removeEventListener("stagemouseup");
    stage.removeEventListener("stagemousemove");
    lineContainer.removeChild(connection);

    first_point = game.points[(mouseDownTarget.y - 70) / 100][(mouseDownTarget.x - 300) / 100]

    var target, targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].name == "target") {
            target = targets[i];
            break;
        }
    }

    var last_point;
    if (target) {
        last_point = game.points[(target.y - 70) / 100][(target.x - 300) / 100];
    }

    if (target != null && validateMove(first_point, last_point)) {

        var line = game.lines[lineName(first_point, last_point)];
        line.filled = true;
        line.color = player.color;

        socket.emit("play", line);

    }


}

function drawLine(line) {
    var drawingLine = new createjs.Shape();
    lineContainer.addChild(drawingLine);
    drawingLine.graphics.clear();
    drawingLine.graphics.setStrokeStyle(3);
    drawingLine.graphics.beginStroke(line.color);
    drawingLine.graphics.moveTo(line.point1.x, line.point1.y);
    drawingLine.graphics.lineTo(line.point2.x, line.point2.y);

    drawingLine.alpha = 0;

    createjs.Tween.get(drawingLine).to({
        alpha: 1
    }, 500);
}

function drawSquare(squares, scorePlayer) {

    for (square of squares) {
        var rect = new createjs.Shape();
        rect.graphics.beginFill(scorePlayer.color).drawRect(square.points[0].x - 1, square.points[0].y - 1, 102, 102);
        squareContainer.addChild(rect);

        rect.alpha = 0;

        createjs.Tween.get(rect).to({
            alpha: 1
        }, 500);
    }

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