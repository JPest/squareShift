var socket = io();
var player = new Player();

socket.on("login", function (socketID) {
    player.id = socketID;
});


socket.on("score", function (result) {
    drawSquare(result.squares, result.player);
    updateScore(result.player);
});


socket.on("startGame", function (serverGame) {
    game = serverGame;
    introAnimation();

    updateScore();

    for (serverPlayer of game.players) {
        if (serverPlayer.id == player.id) {
            player.color = serverPlayer.color;
            canvas.style.border = "5px solid " + player.color;
        }
    }

    if (game.roundPlayer.id == player.id) {

        canvas.style.pointerEvents = "auto";
    } else {
        canvas.style.pointerEvents = "none";
    }
});

socket.on("play", function (data) {
    game = data.game;
    drawLine(data.line);

    updateScore();

    if (data.game.roundPlayer.id == player.id) {
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
    game = result.game;
    alert(result.player + " saiu");

    updateScore();

    if (result.game.roundPlayer.id == player.id) {
        canvas.style.pointerEvents = "auto";
    } else {
        canvas.style.pointerEvents = "none";
    }
});


function drawLine(line) {}

function updateScore() {

    playerAvatar1.alpha = 0.1;
    playerAvatar2.alpha = 0.1;
    playerAvatar3.alpha = 0.1;



    switch (game.roundPlayer.color) {
    case "red":
        playerScore1.text = game.roundPlayer.score;
        createjs.Tween.get(playerAvatar1).to({
            alpha: 1
        }, 500);
        break;

    case "green":
        playerScore2.text = game.roundPlayer.score;
        createjs.Tween.get(playerAvatar2).to({
            alpha: 1
        }, 500);
        break;

    case "blue":
        playerScore3.text = game.roundPlayer.score;
        createjs.Tween.get(playerAvatar3).to({
            alpha: 1
        }, 500);
        break;
    }





}