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
        var roomName = this.gameRoom;
        var game = games[roomName];

        io.to(roomName).emit("play", line);

        if (checkGameover()) {
            //Checar quem ganhou
            //data = jogador
            //io.to(roomName).emit("gameover", data);   
        }

    });

    socket.on('disconnect', function () {
        io.to(this.room).emit("playerOut", this.id);
    });

    while (waitingPlayers.length >= 3) {

        var roomName = "" + (games.length + 1);

        var roomPlayers = waitingPlayers.splice(0, 3);

        var newGame = {
            id: roomName,
            players: []
        };

        for (player of roomPlayers) {
            player.join(roomName);
            player.gameRoom = roomName;
            newGame.players.push(player.id);
        }

        games[roomName] = newGame;

        io.to(roomName).emit("startGame", newGame);

    }

});

server.listen(80);


function checkGameover() {}