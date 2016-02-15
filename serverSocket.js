var waitingPlayers = [];
var games = []; //Dicionário onde chave = idDaSala e valor = objeto Game

//Express é um framework que permite implementar um webServer ao lidar com as requisições HTTP
var express = require('express');
var app = express();
var server = require('http').Server(app);
app.use(express.static("public"));

//A socket.io gerencia o uso de sockets
var io = require('socket.io')(server);

io.on('connection', function (socket) {

    io.to(socket.id).emit("login", socket.id);
    waitingPlayers.push(socket);

    socket.on('play', function (line) {

        var data = [];
        var roomName = this.gameRoom;
        var game = games[roomName];


        if (!checkFilledSquare()) {

            if (game.roundPlayerIndex >= game.players.length - 1) {
                game.roundPlayerIndex = 0;
            } else {
                game.roundPlayerIndex++;
            }

            game.roundPlayer = game.players[game.roundPlayerIndex];

        }

        if (checkGameover()) {
            //Checar quem ganhou
            //data = jogador
            //io.to(roomName).emit("gameover", data);   
        }

        data["game"] = game;
        data["line"] = line;

        io.to(roomName).emit("play", {
            game: game,
            line: line
        });

    });

    socket.on('disconnect', function () {
        var index = waitingPlayers.indexOf(this);
        if (index >= 0) {
            waitingPlayers.pop(index);
        }
        io.to(this.room).emit("playerOut", this.id);
    });

    while (waitingPlayers.length >= 3) {

        var roomName = "" + (games.length + 1);

        var roomPlayers = waitingPlayers.splice(0, 3);

        var newGame = createNewGame();
        newGame.id = roomName;

        for (player of roomPlayers) {
            player.join(roomName);
            player.gameRoom = roomName;
            newGame.players.push(player.id);
        }

        newGame.roundPlayer = newGame.players[newGame.roundPlayerIndex];

        games[roomName] = newGame;

        io.to(roomName).emit("startGame", newGame);

    }

});

server.listen(80);

function createNewGame() {

    return {
        squares: [], //Quadrados aqui
        lines: [],
        points: [],
        filledSquareCount: 0,
        players: [], //Jogadores aqui
        roundPlayer: "none",
        roundPlayerIndex: 0
    };

}


function checkGameover() {}

function checkFilledSquare() {
    return false;
}