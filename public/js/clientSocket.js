var socket = io();
var userID = "";

socket.on("login", function (socketID) {
    userID = socketID;
});

socket.on("startGame", function (serverGame) {
    game = serverGame;
    introAnimation();

    if (game.roundPlayer == userID) {
        alert("sua vez");
        canvas.style.pointerEvents = "auto";
    } else {
        canvas.style.pointerEvents = "none";
    }
});

socket.on("play", function (data) {

    drawLine(data.line);

    if (data.game.roundPlayer == userID) {
        alert("sua vez");
        canvas.style.pointerEvents = "auto";
    } else {
        canvas.style.pointerEvents = "none";
    }
});

socket.on("gameover", function (socketID) {
    endingAnimation();
});

socket.on("playerOut", function (socketID) {
    alert(socketID + " saiu");
});

function endingAnimation() {}

function drawLine(line) {}

function introAnimation() {}