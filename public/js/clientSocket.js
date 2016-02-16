var socket = io();
var player = new Player();

socket.on("login", function (socketID) {
    player.id = socketID;
});


socket.on("score", function (result) {
    alert(result.player.color + " fechou " + result.squares.length + " quadrado(s)");
    drawSquare(result.squares, result.player);
    updateScore(result.player);
});


socket.on("startGame", function (serverGame) {
    game = serverGame;
    introAnimation();

    for (serverPlayer of game.players) {
        if (serverPlayer.id == player.id) {
            player.color = serverPlayer.color;
        }
    }

    if (game.roundPlayer.id == player.id) {
        alert("sua vez");
        canvas.style.pointerEvents = "auto";
    } else {
        canvas.style.pointerEvents = "none";
    }
});

socket.on("play", function (data) {
    game = data.game;
    drawLine(data.line);

    if (data.game.roundPlayer.id == player.id) {
        alert("sua vez " + player.color);
        canvas.style.pointerEvents = "auto";
    } else {
        canvas.style.pointerEvents = "none";
    }
});

socket.on("gameover", function (winningPlayer) {
    alert("Fim de jogo!\n" + winningPlayer.color + " ganhou!");
    canvas.style.pointerEvents = "none";
});

socket.on("playerOut", function (result) {
    alert(result.player.color + " saiu");

    if (result.game.roundPlayer.id == player.id) {
        alert("sua vez " + player.color);
        canvas.style.pointerEvents = "auto";
    } else {
        canvas.style.pointerEvents = "none";
    }
});


function drawLine(line) {}

function updateScore() {

}