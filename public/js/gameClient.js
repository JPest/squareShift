var connection = new createjs.Shape();
var game = undefined;
var loadingContainer = new createjs.Container();
var mouseDownTarget;

var playerAvatar1 = new createjs.Shape();
var playerAvatar2 = new createjs.Shape();
var playerAvatar3 = new createjs.Shape();
var playerScore1 = new createjs.Text("0", "35px Arial", "#ffffff");
var playerScore2 = new createjs.Text("0", "35px Arial", "#ffffff");
var playerScore3 = new createjs.Text("0", "35px Arial", "#ffffff");




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
    text.x = canvas.width / 2 + 25;
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
        for (i = 600; i <= 800; i += 200) {

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
            hitArea.graphics.beginFill("#000").drawCircle(0, 0, 45);
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

    first_point = game.points[(mouseDownTarget.y - 50) / 100][(mouseDownTarget.x - 400) / 100]

    var target, targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].name == "target") {
            target = targets[i];
            break;
        }
    }

    var last_point;
    if (target) {
        last_point = game.points[(target.y - 50) / 100][(target.x - 400) / 100];
    } else {
        lineContainer.removeChild(connection);
    }

    if (target != null && last_point != first_point) {
        if (validateMove(first_point, last_point)) {
            var line = game.lines[lineName(first_point, last_point)];
            line.filled = true;
            line.color = player.color;

            socket.emit("play", line);
        }

    } else {
        lineContainer.removeChild(connection);
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
    lineContainer.removeChild(connection);
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


function placar() {
    var ctnPlacar = new createjs.Container();
    ctnPlacar.x = 0;
    ctnPlacar.y = 0;


    playerAvatar1.graphics.beginFill("red").drawCircle(150, canvas.height * 0.25 + 20, 50);
    playerAvatar1.regX = 25;
    playerAvatar1.regY = 25;
    playerAvatar1.alpha = 0.1;
    stage.addChild(playerAvatar1);
    playerScore1.regX = playerScore1.width / 2;
    playerScore1.regY = playerScore1.height / 2;
    playerScore1.x = 115;
    playerScore1.y = canvas.height * 0.25 + 10;
    playerScore1.textBaseline = "alphabetic";
    stage.addChild(playerScore1);


    playerAvatar2 = new createjs.Shape();
    playerAvatar2.graphics.beginFill("green").drawCircle(150, canvas.height * 0.5 + 20, 50);
    playerAvatar2.regX = 25;
    playerAvatar2.regY = 25;
    playerAvatar2.alpha = 0.1;
    stage.addChild(playerAvatar2);
    playerScore2.regX = playerScore2.width / 2;
    playerScore2.regY = playerScore2.height / 2;
    playerScore2.x = 115;
    playerScore2.y = canvas.height * 0.5 + 10;
    playerScore2.textBaseline = "alphabetic";
    stage.addChild(playerScore2);


    playerAvatar3 = new createjs.Shape();
    playerAvatar3.graphics.beginFill("blue").drawCircle(150, canvas.height * 0.75 + 20, 50);
    playerAvatar3.regX = 25;
    playerAvatar3.regY = 25;
    playerAvatar3.alpha = 0.1;
    stage.addChild(playerAvatar3);
    playerScore3.regX = playerAvatar3.width / 2;
    playerScore3.regY = playerAvatar3.height / 2;
    playerScore3.x = 115;
    playerScore3.y = canvas.height * 0.75 + 10;
    playerScore3.textBaseline = "alphabetic";
    stage.addChild(playerScore3);

}

function tick(event) {
    stage.update();
}

placar();