var socket = io();
var userID = "";

socket.on("login", function (socketID) {
    userID = socketID;
});

socket.on("startGame", function (game) {
    introAnimation();
    var string = "3 jogadores entraram, o jogo irá iniciar.\n";
    var count = 1;
    for (player of game.players) {
        string += "Jogador " + count + ": " + player + "\n";
        count++;
    }

    alert(string);

    if (game.nextPlayer == userID) {
        enableCanvas();
    } else {
        disableCanvas();
    }
});

socket.on("play", function (line) {

    drawLine(line);
    /*drawLine(data["line"]);

    if (data["game"].nextPlayer == userID) {
        enableCanvas();
    } else {
        disableCanvas();
    }*/
});

socket.on("gameover", function (socketID) {
    endingAnimation();
});

socket.on("playerOut", function (socketID) {
    alert(socketID + " saiu");
});

function endingAnimation() {}

function drawLine(line) {}

function enableCanvas() {}

function disableCanvas() {}

function introAnimation() {}